import { ApiProperty } from '@nestjs/swagger';
import {
IsDateString,
IsNotEmpty,
IsOptional,
IsString,
IsUUID
} from 'class-validator';
import { Genre, SongLanguage } from '../../../shared/entities/song.entity';

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
 @IsUUID()
artistId: string;

@ApiProperty({ required: true, description: 'Album ID' })
@IsOptional()
 @IsUUID()
albumId: string;


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

@ApiProperty({
required: true,
description: 'The song language',
example: 'english',
})
@IsString()
@IsNotEmpty()
language: SongLanguage;



@ApiProperty({
required: true,
description: 'The song lyrics',
example: 'song lyrics'
})
@IsString()
@IsOptional()
lyrics: string;

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
 @IsUUID()
artistId: string;

@ApiProperty({ required: true, description: 'Album ID' })
@IsOptional()
 @IsUUID()
albumId: string;


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

@ApiProperty({
required: true,
description: 'The song language',
example: 'english',
})
@IsString()
@IsNotEmpty()
language: SongLanguage;





@ApiProperty({
required: true,
description: 'The song lyrics',
example: 'song lyrics'
})
@IsString()
@IsOptional()
lyrics: string;
}



export class CreateSongWithFileDTO extends CreateSongDTO {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: true,
    description: 'The audio file to upload',
  })
  file: any;
}


export class UpdateSongWithFileDTO extends UpdateSongDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'The audio file to upload',
  })
  file?: any;
}