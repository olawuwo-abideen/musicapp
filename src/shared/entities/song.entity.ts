import { Artist } from 'src/shared/entities/artists.entity';
import { Playlist } from 'src/shared/entities/playlist.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('songs')
export class Song {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  // @Column('varchar', { array: true })
  // artists: string[];

  @Column('date')
  releasedDate: Date;

  @Column('time')
  duration: Date;

  @Column('text')
  lyrics: string;

  @ManyToMany(() => Artist, (artist) => artist.songs, { cascade: true })
  @JoinTable({ name: 'songs_artists' })
  artists: Artist[];

  /**
   * Many songs can belong to playlist for each unique user
   */
  @ManyToOne(() => Playlist, (playList) => playList.songs)
  playList: Playlist;
}
