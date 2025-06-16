import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Song } from './song.entity';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity('Like')
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.likes)
  user: User;

  @ManyToOne(() => Song, song => song.likes)
  song: Song;


  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Exclude()
  deletedAt: Date;
}
