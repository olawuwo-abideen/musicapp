import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from '../../shared/entities/song.entity';
import { Favorite } from 'src/shared/entities/favorite.entity';
import { User } from 'src/shared/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-store';


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
    TypeOrmModule.forFeature([Favorite, Song, User]),
  ],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
