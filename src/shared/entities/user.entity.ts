import { Exclude } from 'class-transformer';
import { Playlist } from 'src/shared/entities/playlist.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

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
twoFASecret: string;

@Column({ default: false, type: 'boolean' })
enable2FA: boolean;

@Column()
apiKey: string;


@OneToMany(() => Playlist, (playList) => playList.user)
playLists: Playlist[];
}
