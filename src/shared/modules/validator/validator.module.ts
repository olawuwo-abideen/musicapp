import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { UsersModule } from 'src/app/users/users.module';


@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User])],
})
export class ValidatorModule {}
