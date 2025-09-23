// src/orders/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customerName: string; // untuk guest checkout

    @Column()
    customerEmail: string;

    @Column('json')
    items: any; // simpan detail produk yang dibeli

    @Column('decimal')
    totalAmount: number;

    @Column()
    paymentMethod: string; // COD / QRIS

    @Column({ default: 'pending' })
    status: string; // pending, paid, shipped, etc.

    @CreateDateColumn()
    createdAt: Date;
}
