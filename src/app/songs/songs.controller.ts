import {
Controller,
Get,
Put,
Delete,
Post,
Param,
Body,
Query
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO, UpdateSongDto } from './dto/song-dto';
import { ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';

@Controller('songs')
@ApiTags('songs')
export class SongsController {
constructor(private songsService: SongsService) {}



@Post('')
public async createSong(
@Body() data: CreateSongDTO,
) {
return await this.songsService.createSong(data)

}

@Put(':id')
public async updateSong(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateSongDto,
) {
return  await this.songsService.updateSong(
id,
data,
)
}


@Get('')
public async getSongs(
@Query() paginationData: PaginationDto,
) {
return await this.songsService.getSongs(
paginationData,
);
}


@Get('search')
public async searchSongs(
@Query('q') searchQuery: string | null,
@Query() paginationData: PaginationDto,
) {
return await this.songsService.searchSongs(
searchQuery,
paginationData,
);
}


@Delete('/:id')
public async deleteSong(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.songsService.deleteSong(id)

}


}