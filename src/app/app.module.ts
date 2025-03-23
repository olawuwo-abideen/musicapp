import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmConfigService } from '../shared/services/typeorm/typeorm-config.service';
import { SongsModule } from './songs/songs.module';
import { PlayListModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true, 
      useFactory: async () => ({
        store: await redisStore({
          socket: { host: 'localhost', port: 6379 },
        }),
        ttl: 600, 
      }),
    }),
    SongsModule,
    PlayListModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
