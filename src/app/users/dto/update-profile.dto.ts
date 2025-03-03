import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsString, IsNumber } from 'class-validator';



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


}



