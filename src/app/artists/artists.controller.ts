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
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { IsValidUUIDPipe } from '../../shared/pipes/is-valid-uuid.pipe';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { PaginationDto } from 'src/shared/dtos/pagination.dto';



@ApiBearerAuth()
@Controller('artist')
@ApiTags('Artist')
export class ArtistsController {
constructor(private artistService: ArtistsService) {}

@Post('')
@ApiOperation({ summary: 'Create artist' })
public async createArtist(
@Body() data: CreateArtistDTO,
) {
return await this.artistService.createArtist(data)
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('')
@ApiOperation({ summary: 'Get artist' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async getArtists(@Query() pagination: PaginationDto) {
  return await this.artistService.getArtists(pagination);
}

@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get('search')
@ApiOperation({ summary: 'Search artist' })
@ApiQuery({ name: 'query', required: false, example: 'Drake' })
@ApiQuery({ name: 'page', required: false, example: 1 })
@ApiQuery({ name: 'pageSize', required: false, example: 10 })
public async searchArtistByName(
  @Query('query') searchQuery: string | null,
  @Query() pagination: PaginationDto,
) {
  return await this.artistService.searchArtistByName(searchQuery, pagination);
}

@Get('leaderboard')
@ApiOperation({ summary: 'Get artist by album' })
async getLeaderboard(@Query('limit') limit: number = 10) {
  return this.artistService.getTopArtists(limit);
}


@UseInterceptors(CacheInterceptor)
@CacheKey('__key')
@CacheTTL(60000)
@Get(':id')
@ApiOperation({ summary: 'Get an artist' })
public async getArtist(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.artistService.getArtist(id)

}

@Put(':id')
@ApiOperation({ summary: 'Update an artist' })
public async updateArtist(
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateArtistDTO,
) {
return  await this.artistService.updateArtist(
id,
data,
)
}


@Delete(':id')
@ApiOperation({ summary: 'Delete an artist' })
public async deleteArtist(
@Param('id', IsValidUUIDPipe) id: string,
) {
return await this.artistService.deleteArtist(id)
}



}