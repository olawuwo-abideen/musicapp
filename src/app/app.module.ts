import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmConfigService } from '../shared/services/typeorm/typeorm-config.service';
import { SongsModule } from './songs/songs.module';
import { PlayListModule } from './playlists/playlists.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { ConfigModule } from '@nestjs/config';


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
    SongsModule,
    PlayListModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}





