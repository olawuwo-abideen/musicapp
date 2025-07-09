// entities/feedback.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity('feeback')
export class Feedback {
@PrimaryGeneratedColumn('uuid')
id: string;

@ManyToOne(() => User, { eager: true, nullable: true })
user: User;

@Column({ length: 100 })
message: string;

@Column()
rating: number;

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
