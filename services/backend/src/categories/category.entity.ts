// src/categories/category.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../products/product.entity';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: 'no description' })
    description: string; // optional

    @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
    status: 'active' | 'inactive';

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
