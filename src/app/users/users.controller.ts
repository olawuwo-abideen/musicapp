import { Body, Controller, Get, HttpStatus, Post, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../shared/decorators/current-user.decorator';
import RequestWithUser from '../../shared/dtos/request-with-user.dto';
import { User } from '../../shared/entities/user.entity';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Validate2faTokenDTO } from "./dto/validate-token.dto"

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


@Post('initiate-2fa')
@ApiOperation({ summary: 'Initiate Multi Factor Authentication' })
async initiate2FASetup(
  @CurrentUser() user: User
): Promise<{ message: string, secret: string }> {
  return this.userService.initiate2FASetup(user);
}


@Post('verify-2fa')
@ApiOperation({ summary: 'Validate Multi Factor Authentication' })
async verify2FA(
@CurrentUser() user: User,
@Body()
ValidateTokenDTO: Validate2faTokenDTO,
): Promise<{ verified: boolean; message: string }> {
return this.userService.verify2FASetup(
user,
ValidateTokenDTO.token,
);
}


@Post('disable-2fa')
@ApiOperation({ summary: 'Disable 2 Factor Authentication' })
async disable2FA(
@CurrentUser() user: User,
): Promise<{  message: string }> {
return this.userService.disable2FA(user);
}



}
