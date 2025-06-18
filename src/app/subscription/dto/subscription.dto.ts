import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class RenewSubscriptionDto {
@ApiProperty({
required: true,
description: 'The plan id',
example: '04e0197c-d833-4bf0-8a60-cd436cb7ec76',
})
@IsUUID()
@IsNotEmpty()
planId: string;

@ApiProperty({
required: false,
description: 'The plan reference',
example: '04e0197c-d833-4bf0-8a60-cd436cb7ec76',
})
@IsString()
@IsOptional()
reference?: string;

}
