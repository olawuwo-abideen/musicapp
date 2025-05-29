import { Exclude, instanceToPlain } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Song } from './song.entity';
import { Album } from './album.entity';


@Entity('artist')
export class Artist {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ unique: true })
artistName: string;

@Column()
country: string;

@Column()
artistGenre: string;

@Column()
imageUrl: string;

@Column({ default: 0 })
playCounter: number;

@OneToMany(() => Song, song => song.artist)
songs: Song[];


@OneToMany(() => Album, album => album.artist)
albums: Album[];


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
