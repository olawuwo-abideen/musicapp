import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follower } from '../../shared/entities/follower.entity';
import { Artist } from '../../shared/entities/artist.entity';
import { FollowerService } from './follower.service';
import { FollowerController } from './follower.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Follower, Artist])],
  controllers: [FollowerController],
  providers: [FollowerService],
})
export class FollowerModule {}
