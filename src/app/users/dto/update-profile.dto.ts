import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsString, IsNumber, IsDateString } from 'class-validator';



export class UpdateProfileDto {
  @ApiProperty({
    description: 'First name of the user.',
    example: 'John',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Last name of the user.',
    example: 'Doe',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
  required: true,
  description: 'The date of birth of the user in YYYY-MM-DD format',
  example: '1990-01-01',
  })
  @IsDateString()
  dob: string;

}



