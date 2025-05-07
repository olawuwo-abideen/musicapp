import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ValidateTokenDTO } from './dto/validate-token.dto';
import { User } from '../../shared/entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;

  const mockUser: User = {
    id: 'user-id',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashed_password',
    resetToken: null,
    twoFASecret: null,
    enable2FA: false,
    apiKey: null,
    playlists: [],
    songs: [],
    favorites: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    toJSON: jest.fn(),
  };

  const mockUsersService = {
    profile: jest.fn(),
    changePassword: jest.fn(),
    updateProfile: jest.fn(),
    enable2FA: jest.fn(),
    validate2FAToken: jest.fn(),
    disable2FA: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      usersService.profile.mockResolvedValue(mockUser);
      const result = await controller.getProfile({ user: mockUser } as any);
      expect(result).toEqual(mockUser);
      expect(usersService.profile).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('changePassword', () => {
    it('should change user password', async () => {
      const dto: ChangePasswordDto = {
        currentPassword: 'OldPass123!',
        password: 'NewPass123!',
        confirmPassword: 'NewPass123!',
      };

      usersService.changePassword.mockResolvedValue({ message: 'Password updated' });
      const result = await controller.changePassword(dto, mockUser);
      expect(result).toEqual({ message: 'Password updated' });
      expect(usersService.changePassword).toHaveBeenCalledWith(dto, mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const dto: UpdateProfileDto = {
        firstName: 'Jane',
        lastName: 'Doe',
      };

      usersService.updateProfile.mockResolvedValue({ message: 'Profile updated' });
      const result = await controller.updateProfile(dto, mockUser);
      expect(result).toEqual({ message: 'Profile updated' });
      expect(usersService.updateProfile).toHaveBeenCalledWith(dto, mockUser);
    });
  });

  describe('enable2FA', () => {
    it('should return 2FA setup details', async () => {
      const response = { secret: '2FASecret', message: '2FA enabled' };
      usersService.enable2FA.mockResolvedValue(response);

      const result = await controller.enable2FA(mockUser);
      expect(result).toEqual(response);
      expect(usersService.enable2FA).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('validate2FA', () => {
    it('should validate 2FA token', async () => {
      const dto: ValidateTokenDTO = { token: '123456' };
      usersService.validate2FAToken.mockResolvedValue({ verified: true });

      const result = await controller.validate2FA(mockUser, dto);
      expect(result).toEqual({ verified: true });
      expect(usersService.validate2FAToken).toHaveBeenCalledWith(mockUser, dto.token);
    });
  });

  describe('disable2FA', () => {
    it('should disable 2FA', async () => {
      usersService.disable2FA.mockResolvedValue({ message: '2FA disabled' });

      const result = await controller.disable2FA(mockUser);
      expect(result).toEqual({ message: '2FA disabled' });
      expect(usersService.disable2FA).toHaveBeenCalledWith(mockUser);
    });
  });
});
