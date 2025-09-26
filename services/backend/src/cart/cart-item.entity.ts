// cart-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';

@Entity()
export class CartItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'cartId' })
    cart: Cart;

    @Column()
    cartId: number;

    @ManyToOne(() => Product, { eager: true })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: number;

    @Column('int', { default: 1 })
    quantity: number;

    // cached price snapshot (optional, useful if product price changes later)
    @Column('decimal', { precision: 12, scale: 2 })
    price: number;
}
