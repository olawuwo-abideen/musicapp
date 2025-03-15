import {
Controller,
Get,
Put,
Delete,
Post,
Param,
Body,
Query,
Req
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDTO, UpdateSongDto } from './dto/song-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from 'src/shared/pipes/is-valid-uuid.pipe';
import { CurrentUser } from 'src/shared/decorators/current-user.decorator';
import { User } from 'src/shared/entities/user.entity';



@ApiBearerAuth()
@Controller('song')
@ApiTags('Song')
export class SongsController {
constructor(private songsService: SongsService) {}

@Post('')
public async createSong(
@Body() data: CreateSongDTO,
) {
return await this.songsService.createSong(data)
}

@Get('')
public async getSongs(
) {
return await this.songsService.getSongs(
);
}


@Get('favorite')
async getFavorites(@CurrentUser() user: User) {
return await this.songsService.getFavorites(user);
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




@Get(':id')
public async getSong(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.songsService.getSong(id)

}


@Get('search')
public async searchSongs(
@Query('query') searchQuery: string | null,
) {
return await this.songsService.searchSongs(
searchQuery,
);
}

@Delete(':id')
public async deleteSong(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.songsService.deleteSong(id)
}




@Post('favorite/:id')
async addToFavorites(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string,

) {
return this.songsService.addToFavorites(user, id);
}

@Delete('favorite/:id')
async removeFromFavorites(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string,

) {
return this.songsService.removeFromFavorites(user, id);
}




}