import { ApiProperty } from '@nestjs/swagger';
import {
IsNotEmpty,
IsString
} from 'class-validator';

export class CreateAlbumDTO {

@ApiProperty({
required: true,
description: 'The album title',
example: 'The Tortured Poets Department',
})
@IsString()
@IsNotEmpty()
title: string;

@ApiProperty({ required: true, description: 'Artist ID' })
@IsNotEmpty()
artistId: string;

@ApiProperty({
required: true,
description: 'The artist country',
example: '2019-11-29T00:00:00.000Z',
})
@IsNotEmpty()
releaseDate: Date;

@ApiProperty({
required: true,
description: 'The artist genre',
example: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Taylor_Swift_%E2%80%93_The_Tortured_Poets_Department_%28album_cover%29.png',
})
@IsString()
@IsNotEmpty()
coverImageUrl: string;

}

export class  UpdateAlbumDTO{

@ApiProperty({
required: true,
description: 'The album title',
example: 'The Tortured Poets Department',
})
@IsString()
@IsNotEmpty()
title: string;

@ApiProperty({ required: true, description: 'Artist ID' })
@IsNotEmpty()
artistId: string;

@ApiProperty({
required: true,
description: 'The artist country',
example: '2019-11-29T00:00:00.000Z',
})
@IsNotEmpty()
releaseDate: Date;

@ApiProperty({
required: true,
description: 'The artist genre',
example: 'https://upload.wikimedia.org/wikipedia/en/6/6e/Taylor_Swift_%E2%80%93_The_Tortured_Poets_Department_%28album_cover%29.png',
})
@IsString()
@IsNotEmpty()
coverImageUrl: string;
}