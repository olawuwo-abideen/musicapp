import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Song } from './song.entity';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity('songreport')
export class SongReport {
@PrimaryGeneratedColumn('uuid')
id: string;

@ManyToOne(() => Song, { eager: true, onDelete: 'CASCADE' })
song: Song;

@ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
reportedBy: User;

@Column()
reason: string;

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

}
