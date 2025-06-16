import { Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { User } from './user.entity';
import { Artist } from './artist.entity';

@Entity('followers')
export class Follower {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.following, { eager: true })
  user: User;

  @ManyToOne(() => Artist, (artist) => artist.followers, { eager: true })
  artist: Artist;
}
