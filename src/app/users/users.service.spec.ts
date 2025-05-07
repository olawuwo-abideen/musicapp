import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as speakeasy from 'speakeasy';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockUser = {
    id: 'user-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedPassword',
    twoFASecret: null,
    enable2FA: false,
  } as unknown as User;

  const mockRepo = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    existsBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should return user profile', async () => {
    const result = await service.profile(mockUser);
    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockUser);
  });

  it('should throw if current password does not match', async () => {
    mockRepo.findOne.mockResolvedValue({ ...mockUser, password: 'wrongPassword' });
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

    const payload: ChangePasswordDto = {
      currentPassword: 'wrong',
      password: 'NewPass123!',
      confirmPassword: 'NewPass123!',
    };

    await expect(service.changePassword(payload, mockUser)).rejects.toThrow(BadRequestException);
  });

  it('should update the password successfully', async () => {
    mockRepo.findOne.mockResolvedValue(mockUser);
    jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);
    jest.spyOn(bcrypt, 'hash').mockImplementation(async () => 'newHashedPassword');
    jest.spyOn(service, 'update').mockResolvedValue({} as any);

    const payload: ChangePasswordDto = {
      currentPassword: 'correct',
      password: 'NewPass123!',
      confirmPassword: 'NewPass123!',
    };

    const result = await service.changePassword(payload, mockUser);
    expect(result.message).toBe('Password updated successfully.');
  });

  it('should update the user profile', async () => {
    mockRepo.save.mockResolvedValue({ ...mockUser, firstName: 'Jane' });

    const payload: UpdateProfileDto = {
      firstName: 'Jane',
      lastName: 'Smith',
    };

    const result = await service.updateProfile(payload, mockUser);
    expect(result.message).toBe('Profile updated successfully.');
    expect(result.data.firstName).toBe('Jane');
  });

  it('should enable 2FA', async () => {
    mockRepo.save.mockResolvedValue({ ...mockUser, enable2FA: true, twoFASecret: 'secret' });

    const result = await service.enable2FA(mockUser);
    expect(result.message).toBe('2FA has been successfully enabled');
    expect(result.secret).toBeDefined();
  });

  it('should validate a valid 2FA token', async () => {
    const secret = speakeasy.generateSecret();
    const token = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32',
    });

    const userWith2FA = {
      ...mockUser,
      twoFASecret: secret.base32,
      enable2FA: true,
      toJSON: () => ({})  
    };

    const result = await service.validate2FAToken(userWith2FA, token);
    expect(result.verified).toBe(true);
  });

  it('should fail to validate an invalid 2FA token', async () => {
    const secret = speakeasy.generateSecret();

    const userWith2FA = {
      ...mockUser,
      twoFASecret: secret.base32,
      enable2FA: true,
      toJSON: () => ({})  
    };

    const result = await service.validate2FAToken(userWith2FA, 'invalid-token');
    expect(result.verified).toBe(false);
  });

  it('should disable 2FA', async () => {
    mockRepo.update.mockResolvedValue({} as any);

    const result = await service.disable2FA(mockUser);
    expect(result.message).toBe('2FA has been successfully disabled');
  });
});
