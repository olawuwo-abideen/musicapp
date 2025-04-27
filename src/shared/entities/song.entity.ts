import { Playlist } from '../../shared/entities/playlist.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Exclude, instanceToPlain } from 'class-transformer';
import { Favorite } from './favorite.entity';

export enum Genre {
  POP = 'pop',
  ROCK = 'rock',
  HIPHOP = 'hiphop',
  JAZZ = 'jazz',
  ELECTRONIC = 'electronic',
}

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: true})
  @Exclude()
  playListId: string;

  @Column()
  title: string;

  @Column()
  artists: string;

  @Column('date')
  releasedDate: Date;

  @Column('time')
  duration: Date;

  @Column('text')
  genre: Genre;

  @ManyToOne(() => User, (user) => user.songs)
  user: User;
  

  @ManyToOne(() => Playlist, (playList) => playList.songs)
  playList: Playlist;

  @OneToMany(() => Favorite, (favorite) => favorite.song)
  favorites: Favorite[];


  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;
  
  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;
  
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Exclude()
  deletedAt: Date;
  
  toJSON(): Record<string, any> {
    return instanceToPlain(this);
  }
}
