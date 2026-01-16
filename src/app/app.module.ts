import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmConfigService } from '../shared/services/typeorm/typeorm-config.service';
import { AuthModule } from './auth/auth.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { SongsModule } from './songs/songs.module';
import { PlayListModule } from './playlists/playlists.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';
import { SubscriptionModule } from './subscription/subscription.module';
import { LikeModule } from './like/like.module';
import { FollowerModule } from './follower/follower.module';
import { FeedbackModule } from './feedback/feedback.module';
import { RecommendationModule } from './recommendation/recommendation.module';
import { AnalyticsModule } from './analytics/analytics.module';

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
      useFactory: async () => {
        if (process.env.NODE_ENV === 'production') {
          console.warn('Redis cache is disabled in production. Using in-memory cache.');
          return {
            ttl: 600,
          };
        }

        const store = await redisStore({
          socket: {
        host: process.env.REDIS_HOST || 'redis',
        port: Number(process.env.REDIS_PORT) || 6379,
          },
        });

        return {
          store,
          ttl: 600,
        };
      },
    }),

    AuthModule,
    ArtistsModule,
    AlbumsModule,
    SongsModule,
    PlayListModule,
    UsersModule,
    SubscriptionModule,
    LikeModule,
    FollowerModule,
    FeedbackModule,
    RecommendationModule,
    AnalyticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
