// src/users/entities/user.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Role } from './role.enum';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: true })
    email: string | null;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    googleId?: string;

    @Column({ nullable: true })
    name?: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
    role: Role;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
