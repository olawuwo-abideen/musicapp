import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { User } from '../../shared/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import * as speakeasy from 'speakeasy';

@Injectable()
export class UsersService {
constructor(
@InjectRepository(User)
private userRepository: Repository<User>, 
) {}
public async findOne(where: FindOptionsWhere<User>): Promise<User | null> {
return await this.userRepository.findOne({ where });
}


public async create(data: DeepPartial<User>): Promise<User> {
const user: User = await this.userRepository.create(data);
return await this.userRepository.save(user);
}

public async update(
where: FindOptionsWhere<User>,
data: QueryDeepPartialEntity<User>,
): Promise<UpdateResult> {
return await this.userRepository.update(where, data);
}

public async exists(where: FindOptionsWhere<User>): Promise<boolean> {
const user: boolean = await this.userRepository.existsBy(where);

return user;
}

public async profile(user: User): Promise<any> {
return {
success: true,
message: 'User profile retrieved successfully.',
data: user,
};
}


public async changePassword(
data: ChangePasswordDto,
user: User,
): Promise<{ message: string }> {
const userWithPassword = await this.userRepository.findOne({
where: { id: user.id },
select: ['id', 'password']
});

const isMatch = await bcrypt.compare(data.currentPassword, userWithPassword.password);
if (!isMatch) {
throw new BadRequestException(
'The password you entered does not match your current password.',
);
}

const newPassword = await bcrypt.hash(data.password, 10);

await this.update(
{ id: user.id },
{ password: newPassword },
);

return {
message: 'Password updated successfully.',
};
}

public async updateProfile(
data: UpdateProfileDto,
user: User,
): Promise<any> {
const dataToUpdate: Partial<User> = {
firstName: data.firstName,
lastName: data.lastName,
};

Object.assign(user, dataToUpdate);

await this.userRepository.save(user);

return {
message: 'Profile updated successfully.',
data: user
};
}

async initiate2FASetup(user: User): Promise<{ message: string; secret: string }> {
const secret = speakeasy.generateSecret();

await this.userRepository.update(user.id, {
tempTwoFASecret: secret.base32,
tempTwoFAExpiresAt: new Date(Date.now() + 3 * 60 * 1000)
});

return {
message: 'Secret generated, kindly verify within 3 minutes to complete 2FA setup',
secret: secret.base32,
};
}

async verify2FASetup(user: User, token: string): Promise<{ verified: boolean; message: string }> {
const now = new Date();

if (!user.tempTwoFASecret || !user.tempTwoFAExpiresAt) {
throw new BadRequestException('2FA setup not initiated');
}

if (user.tempTwoFAExpiresAt < now) {
await this.userRepository.update(user.id, {
tempTwoFASecret: null,
tempTwoFAExpiresAt: null,
});
throw new BadRequestException('2FA setup has expired. Please try again.');
}

const verified = speakeasy.totp.verify({
secret: user.tempTwoFASecret,
token,
encoding: 'base32',
window: 1,
});

if (!verified) {
return { verified: false, message: 'Invalid verification code' };
}

await this.userRepository.update(user.id, {
twoFASecret: user.tempTwoFASecret,
enable2FA: true,
tempTwoFASecret: null,
tempTwoFAExpiresAt: null,
});

return { verified: true, message: '2FA has been successfully enabled' };
}



async disable2FA(user: User): Promise<{ message: string }> {
await this.userRepository.update(user.id, {
twoFASecret: null,
enable2FA: false,
});

return {
message: '2FA has been successfully disabled',
};
}




}
