import { Body, Controller, Get, HttpStatus, Post, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import RequestWithUser from '../../shared/dtos/request-with-user.dto';
import { User } from '../../shared/entities/user.entity';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Enable2FAType } from '../../shared/types/type';
import {ValidateTokenDTO} from "./dto/validate-token.dto"

@ApiTags('User')
@ApiBearerAuth()
@Controller('user')
export class UsersController {
    
    constructor(private readonly userService: UsersService) {}
    @Get('')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ 
    status: HttpStatus.OK,
    description:
    'User profile retrieve successfully.',
    })
    async getProfile(@Request() req: RequestWithUser) {
    return await this.userService.profile(req.user);
    }
    
    @Post('change-password')
    @ApiOperation({ summary: 'User change password' })
    @ApiBody({ type: ChangePasswordDto, description: 'Change user password' })
    @ApiResponse({
    status: HttpStatus.OK,
    description:
    'User Password updated successfully',
    })
    public async changePassword(
    @Body() payload: ChangePasswordDto,
    @CurrentUser() user: User,
    ) {
    return await this.userService.changePassword(payload, user);
    }
    
    @Put('')
    @ApiOperation({ summary: 'Update user profile' })
    @ApiBody({ type: UpdateProfileDto, description: 'Update user profile data' })
    @ApiResponse({
    status: HttpStatus.OK,
    description:
    'User profile updated successfully',
    })
    public async updateProfile(
    @Body() payload: UpdateProfileDto,
    @CurrentUser() user: User,
    ) {
    return await this.userService.updateProfile(payload, user);
    }


    @Get('enable-2fa')
    enable2FA(
        @CurrentUser() user: User
    ): Promise<Enable2FAType> {
      return this.userService.enable2FA(user);
    }
  
    @Post('validate-2fa')
    validate2FA(
        @CurrentUser() user: User,
      @Body()
      ValidateTokenDTO: ValidateTokenDTO,
    ): Promise<{ verified: boolean }> {
      return this.userService.validate2FAToken(
        user,
        ValidateTokenDTO.token,
      );
    }
    @Get('disable-2fa')
    disable2FA(
      @CurrentUser() user: User,
    ): Promise<{  message: string }> {
      return this.userService.disable2FA(user);
    }
    

}
