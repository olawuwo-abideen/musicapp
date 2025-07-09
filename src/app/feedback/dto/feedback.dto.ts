// dto/report-song.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNotEmpty, MaxLength, IsInt, Min, Max } from 'class-validator';

export class ReportSongDto {

@ApiProperty({
required: true,
description: 'Reason for reporting a song',
example: 'Wicked',
})
@IsString()
@IsNotEmpty()
reason: string;
}



export class FeedbackDto {
@ApiProperty({
required: true,
description: 'The rating message',
example: 'A nice app',
})
@IsNotEmpty()
@IsString()
@MaxLength(100)
message: string;

@ApiProperty({
required: true,
description: 'The app rating',
example: '5',
})
@IsNotEmpty()
@IsInt()
@Min(1)
@Max(5)
rating: number;
}
