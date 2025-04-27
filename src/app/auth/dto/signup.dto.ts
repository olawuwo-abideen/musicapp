import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { PasswordMatch } from '../../../shared/validations/password-validation.dto';

export class SignupDTO {

@ApiProperty({
required: true,
description: 'The first name of the user',
example: 'Jane',
})
@IsString()
@IsNotEmpty()
firstName: string;

@ApiProperty({
required: true,
description: 'The last name of the user',
example: 'Doe',
})
@IsString()
@IsNotEmpty()
lastName: string;

@ApiProperty({
required: true,
description: 'The user email',
example: 'janedoe@gmail.com',
})
@IsEmail()
@IsNotEmpty()
email: string;

@ApiProperty({
required: true,
description: 'The user password (at least 8 characters)',
example: 'Password123--',
})
@IsNotEmpty()
@IsString()
@MinLength(6, { message: 'Password must be at least 6 characters long' })
@MaxLength(20, { message: 'Password must not exceed 20 characters' })
@Matches(
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,])[A-Za-z\d~`|•√π×£¢€¥^={}%✓\]<@#$_&\-+()/?!;:'"*.,]+$/,
{
message:
'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
},
)
password: string;


@ApiProperty({
required: true,
description: 'The user password (at least 8 characters)',
example: 'Password123--',
})
@IsString()
@IsNotEmpty({ message: 'Confirm password is required' })
@PasswordMatch()
confirmPassword: string;
}
