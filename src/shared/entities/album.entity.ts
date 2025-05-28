import { Exclude } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, JoinColumn, ManyToOne } from 'typeorm';
import { Song } from './song.entity';
import { Artist } from './artist.entity';

@Entity('album')
export class Album {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
title: string;

@Column({ type: 'date' })
releaseDate: Date;

@Column({ nullable: true })
coverImageUrl: string;


@Column({ default: 0 })
playCounter: number;

@ManyToOne(() => Artist, artist => artist.albums)
artist: Artist;


@OneToMany(() => Song, song => song.album)
songs: Song[];


@CreateDateColumn({ name: 'created_at' })
createdAt: Date;

@UpdateDateColumn({ name: 'updated_at' })
updatedAt: Date;


@DeleteDateColumn({ name: 'deleted_at', nullable: true })
@Exclude()
deletedAt: Date;

}
