import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty,IsString, IsUUID } from 'class-validator';

export class CreatePlayListDto {

@ApiProperty({
required: true,
description: 'The playlist name',
example: 'Playlist 1',
})
@IsString()
@IsNotEmpty()
name : string;

}


export class UpdatePlayListDto {
@ApiProperty({
required: true,
description: 'The playlist name',
example: 'Playlist 2',
})
@IsString()
@IsNotEmpty()
name : string;

}


export class AddSongToPlayListDto {

@ApiProperty({
required: true,
description: 'The song id',
example: '337f7da3-c8f3-4d2d-ae69-d7fb85ea33bb',
})


@IsNotEmpty()
@IsUUID()
songId: string;


}


export class RemoveSongToPlayListDto {

    @ApiProperty({
    required: true,
    description: 'The song id',
    example: '337f7da3-c8f3-4d2d-ae69-d7fb85ea33bb',
    })
    
    
    @IsNotEmpty()
    @IsUUID()
    songId: string;
    
    
    }

