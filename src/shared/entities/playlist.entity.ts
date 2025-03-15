import { Exclude, instanceToPlain } from 'class-transformer';
import { Song } from 'src/shared/entities/song.entity';
import { User } from 'src/shared/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid'})
  @Exclude()
  userId: string;
  
  @Column()
  name: string;


  @OneToMany(() => Song, (song) => song.playList)
  songs: Song[];


  @ManyToOne(() => User, (user) => user.playlists)
  @JoinColumn({ name: 'user_id' })
  user: User;


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
