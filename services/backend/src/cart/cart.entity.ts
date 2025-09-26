// cart.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CartItem } from './cart-item.entity';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    // If user is logged in, save their ID. Nullable for guests.
    @Column({ nullable: true })
    userId?: number;

    // For guest carts, we return this token to client and client stores it.
    @Column({ nullable: true, unique: true })
    guestToken?: string;

    // Relation to items
    @OneToMany(() => CartItem, (item) => item.cart, { cascade: true, eager: true })
    items: CartItem[];

    // Denormalized totals for convenience (you can compute on the fly instead)
    @Column('decimal', { precision: 12, scale: 2, default: 0 })
    totalPrice: number;

    @Column('int', { default: 0 })
    totalQty: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
