import {
Controller,
Get,
Put,
Delete,
Post,
Param,
Body,
Query,
Req,
UseInterceptors
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { CreateArtistDTO, UpdateArtistDTO } from './dto/artist-dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from '../../shared/pipes/is-valid-uuid.pipe';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';



@ApiBearerAuth()
@Controller('artist')
@ApiTags('Artist')
export class ArtistsController {
constructor(private artistService: ArtistsService) {}

@Post('')
public async createArtist(
@Body() data: CreateArtistDTO,
) {
return await this.artistService.createArtist(data)
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('')
public async getArtists(
) {
return await this.artistService.getArtists(
);
}


@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get(':id')
public async getArtist(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.artistService.getArtist(id)

}

@Put(':id')
public async updateArtist(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateArtistDTO,
) {
return  await this.artistService.updateArtist(
id,
data,
)
}


@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('search')
public async searchArtistByName(
@Query('query') searchQuery: string | null,
) {
return await this.artistService.searchArtistByName(
searchQuery,
);
}

@Delete(':id')
public async deleteArtist(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.artistService.deleteArtist(id)
}


@Get('leaderboard')
async getLeaderboard(@Query('limit') limit: number = 10) {
  return this.artistService.getTopArtists(limit);
}





}