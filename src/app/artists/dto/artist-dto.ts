import { ApiProperty } from '@nestjs/swagger';
import {
IsNotEmpty,
IsString,
} from 'class-validator';
import { Genre } from '../../../shared/entities/song.entity';

export class CreateArtistDTO {

@ApiProperty({
required: true,
description: 'The artist name',
example: 'Taylor Swift',
})
@IsString()
@IsNotEmpty()
artistName : string;

@ApiProperty({
required: true,
description: 'The artist country',
example: 'USA',
})
@IsNotEmpty()
country: string;

@ApiProperty({
required: true,
description: 'The artist genre',
example: 'pop',
})
@IsString()
@IsNotEmpty()
artistGenre: Genre;

@ApiProperty({
required: true,
description: 'The artist image url',
example: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/250px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png',
})
@IsNotEmpty()
imageUrl: string;

}
export class UpdateArtistDTO {

@ApiProperty({
required: true,
description: 'The artist name',
example: 'Taylor Swift',
})
@IsString()
@IsNotEmpty()
artistName : string;

@ApiProperty({
required: true,
description: 'The artist country',
example: 'USA',
})
@IsNotEmpty()
country: string;

@ApiProperty({
required: true,
description: 'The artist genre',
example: 'pop',
})
@IsString()
@IsNotEmpty()
artistGenre: Genre;

@ApiProperty({
required: true,
description: 'The artist image url',
example: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png/250px-Taylor_Swift_at_the_2023_MTV_Video_Music_Awards_%283%29.png',
})
@IsNotEmpty()
imageUrl: string;

}