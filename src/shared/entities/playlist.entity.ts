import { Song } from 'src/shared/entities/song.entity';
import { User } from 'src/shared/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  /**
   * Each Playlist will have multiple songs
   */
  @OneToMany(() => Song, (song) => song.playList)
  songs: Song[];

  /**
   * Many Playlist can belong to a single unique user
   */

  @ManyToOne(() => User, (user) => user.playLists)
  user: User;
}
