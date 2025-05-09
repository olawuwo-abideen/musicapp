import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../../shared/modules/email/email.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../shared/entities/user.entity';
import { Repository, EntityManager } from 'typeorm';
import * as bcryptjs from 'bcryptjs';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { SignupDTO } from './dto/signup.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    firstName: 'Test',
    lastName: 'User',
    resetToken: null,
    twoFASecret: null,
    enable2FA: false,
    apiKey: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    playlists: [],
    songs: [],
    favorites: [],
    toJSON: function (): Record<string, any> {
      throw new Error('Function not implemented.');
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mocked-jwt-token'),
            verify: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test-secret'),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendResetPasswordLink: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn().mockReturnValue(mockUser),
            update: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: EntityManager,
          useValue: {
            transaction: jest.fn().mockImplementation((cb) =>
              cb({
                save: jest.fn().mockResolvedValue(mockUser),
              }),
            ),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should hash the password during signup', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
    jest.spyOn(bcryptjs, 'hash' as any).mockResolvedValue('hashedPassword');

    const result = await authService.signup({
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    } as SignupDTO);

    expect(result).toEqual({
      message: 'User signup successfully',
      user: mockUser,
    });
  });

  it('should throw ConflictException if email already exists', async () => {
    jest.spyOn(userRepository, 'findOne').mockResolvedValue(mockUser);

    await expect(
      authService.signup({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      } as SignupDTO),
    ).rejects.toThrow(ConflictException);
  });

  it('should compare passwords correctly during login', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(bcryptjs, 'compare' as any).mockResolvedValue(true);

    const result = await authService.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result).toEqual({
      message: 'User login successfully',
      token: 'mocked-jwt-token',
      user: mockUser,
    });
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue(mockUser);
    jest.spyOn(bcryptjs, 'compare' as any).mockResolvedValue(false);

    await expect(
      authService.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
