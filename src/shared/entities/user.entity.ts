import { Exclude, instanceToPlain } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Favorite } from './favorite.entity';
import { Playlist } from '../../shared/entities/playlist.entity';
import { Song } from './song.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'varchar', name: 'reset_token', nullable: true })
  @Exclude()
  resetToken: string | null;

  @Column({ nullable: true, type: 'text' })
  @Exclude()
  twoFASecret: string;

  @Column({ default: false, type: 'boolean' })
  @Exclude()
  enable2FA: boolean;

  @Column({ nullable: true })
  @Exclude()
  apiKey: string;

  @OneToMany(() => Playlist, (playlist) => playlist.user)
  playlists: Playlist[];
  

  @OneToMany(() => Song, (song) => song.user)
  songs: Song[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  @Exclude()
  deletedAt: Date;

  toJSON(): Record<string, any> {
    return instanceToPlain(this);
  }
}
