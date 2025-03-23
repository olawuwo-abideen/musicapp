import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayListsController } from './playlists.controller';
import { PlayListsService } from './playlists.service';
import { Playlist } from '../../shared/entities/playlist.entity';
import { Song } from 'src/shared/entities/song.entity';
import { User } from 'src/shared/entities/user.entity';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async () => ({
        store: await redisStore({
          socket: { host: 'localhost', port: 6379 },
        }),
        ttl: 600, 
      }),
    }),
    TypeOrmModule.forFeature([Playlist, Song, User]),
  ],
  controllers: [PlayListsController],
  providers: [PlayListsService],
})
export class PlayListModule {}
