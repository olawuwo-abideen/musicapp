import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignupDTO } from './dto/signup.dto';
import { LoginDTO } from './dto/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dto/reset-password.dto';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
    logout: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should call authService.signup with correct data', async () => {
    const dto: SignupDTO = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'janedoe@gmail.com',
      password: 'Password123--',
      confirmPassword: 'Password123--',
    };
    const result = { message: 'Signed up successfully' };

    mockAuthService.signup.mockResolvedValue(result);

    expect(await authController.signup(dto)).toBe(result);
    expect(mockAuthService.signup).toHaveBeenCalledWith(dto);
  });

  it('should call authService.login with correct data', async () => {
    const dto: LoginDTO = {
      email: 'janedoe@gmail.com',
      password: 'Password123--',
    };
    const token = { accessToken: 'token123' };

    mockAuthService.login.mockResolvedValue(token);

    expect(await authController.login(dto)).toBe(token);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });

  it('should call authService.forgotPassword with correct email', async () => {
    const dto: ForgotPasswordDto = { email: 'janedoe@gmail.com' };
    const result = { message: 'Password reset email sent' };

    mockAuthService.forgotPassword.mockResolvedValue(result);

    expect(await authController.forgotPassword(dto)).toBe(result);
    expect(mockAuthService.forgotPassword).toHaveBeenCalledWith(dto.email);
  });

  it('should call authService.resetPassword with correct data', async () => {
    const dto: ResetPasswordDto = {
      password: 'NewPassword123--',
      confirmPassword: 'NewPassword123--',
      token: 'resetToken123',
    };

    mockAuthService.resetPassword.mockResolvedValue(undefined);

    await authController.resetPassword(dto);
    expect(mockAuthService.resetPassword).toHaveBeenCalledWith(dto);
  });

  it('should call authService.logout and return response', async () => {
    const mockRes: Partial<Response> = {
      clearCookie: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    const mockUser = { id: 'user-123', email: 'test@test.com' };

    mockAuthService.logout.mockResolvedValue({ message: 'Logged out' });

    await authController.signOut(mockUser, mockRes as Response);

    expect(mockAuthService.logout).toHaveBeenCalledWith(mockUser, mockRes);
  });
});
