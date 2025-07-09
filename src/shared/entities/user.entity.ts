import { Exclude, instanceToPlain } from 'class-transformer';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Favorite } from './favorite.entity';
import { Playlist } from '../../shared/entities/playlist.entity';
import { Song } from './song.entity';
import { Like } from './like.entity';
import { Follower } from './follower.entity';
import { Subscription } from './subscription.entity';
import { Payment } from './payment.entity';
import { Stream } from './stream.entity';

@Entity('user')
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

@Column({ type: 'date', nullable: true }) 
dob?: Date;

@Column({ type: 'varchar', name: 'reset_token', nullable: true })
@Exclude()
resetToken: string | null;

@Column({ nullable: true, type: 'text' })
@Exclude()
twoFASecret: string;

@Column({ default: false, type: 'boolean' })
enable2FA: boolean;

@Column({ nullable: true })
@Exclude()
tempTwoFASecret?: string;

@Column({ nullable: true, type: 'timestamp' })
@Exclude()
tempTwoFAExpiresAt?: Date;

@Column({ nullable: true })
@Exclude()
apiKey: string;

@OneToMany(() => Playlist, (playlist) => playlist.user)
playlists: Playlist[];

@OneToMany(() => Follower, (follower) => follower.user)
following: Follower[];

@OneToMany(() => Song, (song) => song.user)
songs: Song[];

@OneToMany(() => Favorite, (favorite) => favorite.user)
favorites: Favorite[];

@OneToMany(() => Like, like => like.user)
likes: Like[];

@OneToMany(() => Subscription, (subscription) => subscription.user)
subscriptions: Subscription[];

@OneToMany(() => Payment, (payment) => payment.user)
payments: Payment[];


@OneToMany(() => Stream, (stream) => stream.user)
streams: Stream[];


@Column({ type: 'timestamp', nullable: true })
lastLogin?: Date;

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
