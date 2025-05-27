import { ApiProperty } from '@nestjs/swagger';
import {
IsDateString,
IsNotEmpty,
IsString,
} from 'class-validator';
import { Genre } from '../../../shared/entities/song.entity';

export class CreateSongDTO {

@ApiProperty({
required: true,
description: 'The song title',
example: 'Wicked',
})
@IsString()
@IsNotEmpty()
title : string;

@ApiProperty({ required: true, description: 'Artist ID' })
@IsNotEmpty()
artistId: string;

@ApiProperty({
required: true,
description: 'The song artists',
example: 'The weekend',
})
@IsNotEmpty()
artists: string;

@ApiProperty({
required: true,
description: 'The song release data',
example: '2019-11-29T00:00:00.000Z',
})
@IsNotEmpty()
@IsDateString()
releasedDate: Date;


@ApiProperty({
required: true,
description: 'The song duration',
example: '00:03:22',
})
@IsNotEmpty()
duration: Date;

@ApiProperty({
required: true,
description: 'The song genre',
example: 'pop',
})
@IsString()
@IsNotEmpty()
genre: Genre;
}

export class UpdateSongDto {
@ApiProperty({
required: true,
description: 'The song title',
example: 'Wicked',
})
@IsString()
@IsNotEmpty()
title : string;


@ApiProperty({ required: true, description: 'Artist ID' })
@IsNotEmpty()
artistId: string;

@ApiProperty({
required: true,
description: 'The song artists',
example: 'The weekend',
})
@IsNotEmpty()
artists: string;

@ApiProperty({
required: true,
description: 'The song release data',
example: '2019-11-29T00:00:00.000Z',
})
@IsNotEmpty()
@IsDateString()
releasedDate: Date;


@ApiProperty({
required: true,
description: 'The song duration',
example: '00:03:22',
})
@IsNotEmpty()
duration: Date;

@ApiProperty({
required: true,
description: 'The song genre',
example: 'pop',
})
@IsString()
@IsNotEmpty()
genre: Genre;
}