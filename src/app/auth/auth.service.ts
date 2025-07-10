import {
BadRequestException,
Injectable,
UnauthorizedException,
NotFoundException,
ConflictException,
HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { EntityManager, Repository } from 'typeorm';
import { SignupDTO } from './dto/signup.dto';
import { User } from '../../shared/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../../shared/modules/email/email.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ConfigService } from '@nestjs/config';
import * as bcryptjs from "bcryptjs"
import axios from "axios";
import * as speakeasy from 'speakeasy';
import { Plan } from 'src/shared/entities/plan.entity';
import { Subscription, SubscriptionStatusEnum } from 'src/shared/entities/subscription.entity';

@Injectable()
export class AuthService {
logger: any;
constructor(
private readonly userService: UsersService,
private readonly jwtService: JwtService,
private readonly configService: ConfigService,
@InjectEntityManager() private readonly entityManager: EntityManager,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
private readonly emailService: EmailService,
@InjectRepository(Plan)
private readonly planRepository: Repository<Plan>,
@InjectRepository(Subscription)
private readonly subscriptionRepository: Repository<Subscription>,

) {}

private async assignFreePlanIfNoneExists(userId: string) {
const existing = await this.subscriptionRepository.findOne({ where: { userId } });
if (existing) return;

const freePlan = await this.planRepository.findOne({ where: { amount: 0 } });
if (!freePlan) return;

await this.subscriptionRepository.save({
userId,
planId: freePlan.id,
expiresAt: new Date('2099-12-31'),
status: SubscriptionStatusEnum.ACTIVE,
});
}



public async signup(data: SignupDTO) {
const existingEmailUser = await this.userRepository.findOne({
where: { email: data.email },
});
if (existingEmailUser) {
throw new ConflictException('Email is already in use');
}

const saltRounds = 10;
const password = await bcryptjs.hash(data.password, saltRounds);

let user: User = this.userRepository.create({
firstName: data.firstName,
lastName: data.lastName,
dob: data.dob,
email: data.email,
password,
});

user = await this.entityManager.transaction(async (manager) => {
const savedUser = await manager.save(User, user);
await this.assignFreePlanIfNoneExists(savedUser.id); 
return savedUser;
});

return {
message: 'User signup successfully',
user,
};
}


public async login({ email, password, twoFAToken }: LoginDto) {
const user: User | null = await this.userService.findOne({ email });

if (!user || !(await bcryptjs.compare(password, user.password))) {
throw new UnauthorizedException('Email or password is incorrect');
}

if (user.enable2FA) {
if (!twoFAToken) {
return {
message: '2FA token required',
requires2FA: true,
};
}

const isTokenValid = speakeasy.totp.verify({
secret: user.twoFASecret,
token: twoFAToken,
encoding: 'base32',
window: 1,
});

if (!isTokenValid) {
throw new UnauthorizedException('Invalid 2FA token');
}
}

await this.assignFreePlanIfNoneExists(user.id);

return {
message: 'User logged in successfully',
token: this.createAccessToken(user),
user,
};
}



public createAccessToken(user: User): string {
return this.jwtService.sign({ sub: user.id });
}

async verifyToken(token: string): Promise<boolean> {
const secretKey = process.env.TURNSTILE_SECRET_KEY;
const response = await axios.post(
"https://challenges.cloudflare.com/turnstile/v0/siteverify",
new URLSearchParams({ secret: secretKey, response: token }),
{ headers: { "Content-Type": "application/x-www-form-urlencoded" } },
);
return response.data.success;
}


async forgotPassword(email: string): Promise<any> {
const user: User | null = await this.userService.findOne({ email });
if (!user) {
throw new NotFoundException(`Email does not exist in our record.`);
}
const payload = { email: user.email };
const token = this.jwtService.sign(payload, {
secret: this.configService.get('JWT_SECRET'),
expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}`,
});
user.resetToken = token;
await this.userRepository.update(
{
id: user.id,
},
{
resetToken: token,
},
);
await this.emailService.sendResetPasswordLink(user);
return { message: 'Reset token sent to user email' };
}


public async decodeConfirmationToken(token: string) {
try {
const payload = await this.jwtService.verify(token, {
secret: this.configService.get('JWT_SECRET'),
});
return payload?.email;
} catch (error) {
if (error?.name === 'TokenExpiredError') {
throw new BadRequestException('Reset password link expired.');
}
throw new BadRequestException('Reset password link expired.');
}
}


async resetPassword(payload: ResetPasswordDto): Promise<void> {
const email = await this.decodeConfirmationToken(payload.token);
const user: User | null = await this.userService.findOne({
email,
resetToken: payload.token,
});
if (!user) {
throw new BadRequestException(`Reset token expired. please try again.`);
}
const saltRounds = 10;
const password = await bcryptjs.hash(payload.password, saltRounds);
await this.userRepository.update(
{ id: user.id },
{ password, resetToken: null },
);
}


async logout(user: Partial<User>, res: Response) {
if (!user || !user.id) {
throw new UnauthorizedException('User identification is missing');
}
try {
res.clearCookie('jwt');
this.logger.log(`User with ID ${user.id} has logged out successfully.`);
return res.status(HttpStatus.OK).json({ message: 'Sign-out successful' });
} catch (error) {
this.logger.error('An error occurred during sign-out.', error);
return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
message: 'An error occurred during sign-out. Please try again later.',
});
}
}



async googleLogin(req) {
if (!req.user) {
return 'No user from google'
}
return {
message: 'User information from google',
user: req.user
}
}










}
