import { Playlist } from '../../shared/entities/playlist.entity';
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
import { User } from './user.entity';
import { Exclude, instanceToPlain } from 'class-transformer';
import { Favorite } from './favorite.entity';
import { Artist } from './artist.entity';
import { Album } from './album.entity';
import { Like } from './like.entity';
import { Stream } from './stream.entity';

export enum Genre {
POP = 'pop',
ROCK = 'rock',
HIPHOP = 'hiphop',
JAZZ = 'jazz',
ELECTRONIC = 'electronic',
}

export enum SongLanguage {
ENGLISH = 'english',
SPANISH = 'spanish',
FRENCH = 'french',
HINDI = 'hindi',
CHINESE = 'chinese',
JAPANESE = 'japanese',
OTHER = 'OTHER',
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


@Column('date')
releasedDate: Date;

@Column('time')
duration: Date;

@Column('text')
genre: Genre;

@Column({nullable: true})
songUrl: string;


@Column({ type: 'text', nullable: true })
lyrics: string;

@Column({ default: 0 })
playCounter: number;

@Column({ default: 0 })
likeCount: number;

@Column({nullable: true})
@Exclude()
albumId: string;

@Column({nullable: true})
@Exclude()
artistId: string;

@Column({
type: 'enum',
enum: SongLanguage,
default: SongLanguage.ENGLISH,
})
language: SongLanguage;

@ManyToOne(() => User, (user) => user.songs)
user: User;


@ManyToOne(() => Playlist, (playList) => playList.songs)
playList: Playlist;

@OneToMany(() => Favorite, (favorite) => favorite.song)
favorites: Favorite[];

@ManyToOne(() => Artist, artist => artist.songs)
@JoinColumn({ name: 'artistId' })
artist: Artist;

@ManyToOne(() => Album, album => album.songs)
album: Album; 

@OneToMany(() => Like, like => like.song)
likes: Like[];

@OneToMany(() => Stream, (stream) => stream.song)
streams: Stream[];

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
