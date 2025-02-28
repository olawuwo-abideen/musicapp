import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from '../shared/common/middleware/logger.middleware';
import { SongsController } from './songs/songs.controller';
import { SongsModule } from './songs/songs.module';
import { PlayListModule } from './playlists/playlists.module';
// import { DataSource } from 'typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { typeOrmAsyncConfig } from 'db/data-source';
import { SeedModule } from '../shared/seed/seed.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../shared/config/configuration';
import { validate } from 'env.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
      isGlobal: true,
      load: [configuration],
      validate: validate,
    }),
    TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
    SongsModule,
    PlayListModule,
    AuthModule,
    UsersModule,
    ArtistsModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
