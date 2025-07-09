import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Song } from './song.entity';


@Entity('streams')
export class Stream {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.streams)
  user: User;

  @ManyToOne(() => Song, (song) => song.streams)
  song: Song;

  @CreateDateColumn()
  streamedAt: Date;
}
