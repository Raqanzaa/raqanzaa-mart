// product.entity.ts (small improvement)
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 12, scale: 2 })
    price: number;

    @Column()
    stock: number;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ type: 'enum', enum: ['normal', 'preorder', 'booking'], default: 'normal' })
    type: 'normal' | 'preorder' | 'booking';

    @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
    status: 'active' | 'inactive';

    @ManyToOne(() => Category, (category) => category.products, { eager: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
