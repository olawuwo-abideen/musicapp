import { Body, Controller, Get, HttpStatus, Post, Put, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import RequestWithUser from 'src/shared/dtos/request-with-user.dto';
import { User } from 'src/shared/entities/user.entity';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

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


}
