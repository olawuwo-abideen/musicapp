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
  
  async enable2FA(user: User): Promise<{ secret: string; message: string }> {
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    if (user.enable2FA) {
      return {
        message: '2FA is already enabled for this user',
        secret: user.twoFASecret,
      };
    }
    const secret = speakeasy.generateSecret();
    user.twoFASecret = secret.base32;
    user.enable2FA = true;
    console.log(secret);
    await this.userRepository.save(user);
    return {
      message: '2FA has been successfully enabled',
      secret: user.twoFASecret,
    };
  }
  
  
  

  async validate2FAToken(user: User, token: string): Promise<{ verified: boolean; message?: string }> {
    try {
      if (!user || !user.twoFASecret) {
        throw new UnauthorizedException('Invalid user or 2FA not enabled');
      }
  
      console.log('User secret:', user.twoFASecret);
      console.log('Token:', token);
  
      const verified = speakeasy.totp.verify({
        secret: user.twoFASecret,
        token,
        encoding: 'base32',
        window: 2, // Allows more time drift
      });
  
      console.log('Verified:', verified);
  
      if (verified) {
        return {
          verified: true,
          message: '2FA verification successful',
        };
      }
  
      return { verified: false };
    } catch (err) {
      throw new UnauthorizedException('Error verifying token');
    }
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
