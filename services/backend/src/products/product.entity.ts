import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('decimal')
    price: number;

    @Column()
    stock: number;

    @Column({ nullable: true })
    imageUrl: string;

    @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
    status: 'active' | 'inactive';

    @ManyToOne(() => Category, (category) => category.products, { eager: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @Column()
    categoryId: number;
}
