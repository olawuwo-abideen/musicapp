import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../shared/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { SignupDTO } from '../auth/dto/signup.dto';
import * as bcrypt from 'bcryptjs';
import { LoginDTO } from 'src/app/auth/dto/login.dto';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>, 
  ) {}

  async create(userDTO: SignupDTO): Promise<User> {
    const user = new User();
    user.firstName = userDTO.firstName;
    user.lastName = userDTO.lastName;
    user.email = userDTO.email;
    user.apiKey = uuid4();

    const salt = await bcrypt.genSalt(); 
    user.password = await bcrypt.hash(userDTO.password, salt); 

    const savedUser = await this.userRepository.save(user);
    delete savedUser.password;
    return savedUser;
  }

  async findOne(data: LoginDTO): Promise<User> {
    const user = await this.userRepository.findOneBy({ email: data.email });
    if (!user) {
      throw new UnauthorizedException('Could not find user');
    }
    return user;
  }
  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id: id });
  }
  async updateSecretKey(userId, secret: string): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        twoFASecret: secret,
        enable2FA: true,
      },
    );
  }
  async disable2FA(userId: number): Promise<UpdateResult> {
    return this.userRepository.update(
      { id: userId },
      {
        enable2FA: false,
        twoFASecret: null,
      },
    );
  }
  async findByApiKey(apiKey: string): Promise<User> {
    return this.userRepository.findOneBy({ apiKey });
  }
}
