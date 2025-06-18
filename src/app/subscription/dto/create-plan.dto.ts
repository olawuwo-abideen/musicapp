import { ApiProperty } from '@nestjs/swagger';
import {
IsString,
IsNotEmpty,
IsDecimal,
IsInt,
ArrayMinSize,
IsOptional,
} from 'class-validator';

export class CreatePlanDto {
@ApiProperty({
required: false,
description: 'The plan name',
example: 'Free plan (Ad-Supported)',
})
@IsString()
@IsNotEmpty()
name: string;

@ApiProperty({
required: false,
description: 'The plan description',
example: 'Ideal for casual listeners who don`t mind ads',
})
@IsString()
@IsOptional()
description: string;

@ApiProperty({
  required: false,
  description: 'The plan features',
  example: ['Ads between songs', 'No offline downloads', 'Lower audio quality'],
})
@IsString({ each: true })
@ArrayMinSize(1)
features: string[];


@ApiProperty({
required: false,
description: 'The plan amount',
example: '10.98',
})
@IsDecimal()
@IsNotEmpty()
amount: number;

@ApiProperty({
required: false,
description: 'The plan duration in month',
example: '1',
})
@IsInt()
@IsNotEmpty()
duration: number;
}
