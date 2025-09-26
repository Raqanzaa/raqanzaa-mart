// cart.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Cart } from './cart.entity';
import { CartItem } from './cart-item.entity';
import { Product } from '../products/product.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart) private cartRepo: Repository<Cart>,
        @InjectRepository(CartItem) private itemRepo: Repository<CartItem>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
        private dataSource: DataSource,
    ) { }

    private async recalcCart(cart: Cart) {
        const items = await this.itemRepo.find({ where: { cartId: cart.id }, relations: ['product'] });
        let totalPrice = 0;
        let totalQty = 0;
        for (const it of items) {
            const priceNum = Number(it.price);
            totalPrice += priceNum * it.quantity;
            totalQty += it.quantity;
        }
        cart.totalPrice = Number(totalPrice.toFixed(2));
        cart.totalQty = totalQty;
        cart.items = items;
        await this.cartRepo.save(cart);
        return cart;
    }

    async findOrCreateCartForUser(userId?: number, guestToken?: string) {
        if (userId) {
            let cart = await this.cartRepo.findOne({ where: { userId } });
            if (!cart) {
                cart = this.cartRepo.create({ userId });
                await this.cartRepo.save(cart);
            }
            return cart;
        } else if (guestToken) {
            let cart = await this.cartRepo.findOne({ where: { guestToken } });
            if (!cart) throw new NotFoundException('Guest cart not found');
            return cart;
        } else {
            // create new guest cart with token
            const token = uuidv4();
            const cart = this.cartRepo.create({ guestToken: token });
            await this.cartRepo.save(cart);
            return cart;
        }
    }

    // Accepts either userId (if logged in) or guestToken header value
    async getCart(userId?: number, guestToken?: string) {
        if (userId) return this.cartRepo.findOne({ where: { userId } });
        if (guestToken) return this.cartRepo.findOne({ where: { guestToken } });
        return null;
    }

    async addToCart(payload: AddToCartDto, userId?: number, guestToken?: string) {
        const product = await this.productRepo.findOne({ where: { id: payload.productId } });
        if (!product) throw new NotFoundException('Product not found');

        // stock logic: for 'normal' require stock >= desired; for preorder/booking you may allow beyond stock.
        if (product.type === 'normal' && product.stock < payload.quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        // get or create cart
        let cart = null;
        if (userId) {
            cart = await this.cartRepo.findOne({ where: { userId } });
            if (!cart) {
                cart = this.cartRepo.create({ userId });
                await this.cartRepo.save(cart);
            }
        } else if (guestToken) {
            cart = await this.cartRepo.findOne({ where: { guestToken } });
            if (!cart) {
                // create new cart with provided token (if client generated)
                cart = this.cartRepo.create({ guestToken });
                await this.cartRepo.save(cart);
            }
        } else {
            cart = this.cartRepo.create({ guestToken: uuidv4() });
            await this.cartRepo.save(cart);
        }

        // check existing item
        let item = await this.itemRepo.findOne({ where: { cartId: cart.id, productId: product.id } });

        // enforce stock for combined quantity
        const newQty = (item ? item.quantity : 0) + payload.quantity;
        if (product.type === 'normal' && product.stock < newQty) {
            throw new BadRequestException('Insufficient stock for requested total quantity');
        }

        if (item) {
            item.quantity = item.quantity + payload.quantity;
            item.price = Number(product.price);
            await this.itemRepo.save(item);
        } else {
            item = this.itemRepo.create({
                cartId: cart.id,
                productId: product.id,
                quantity: payload.quantity,
                price: Number(product.price),
            });
            await this.itemRepo.save(item);
        }

        return this.recalcCart(cart);
    }

    async updateItem(dto: UpdateCartItemDto, userId?: number, guestToken?: string) {
        const cart = userId ? await this.cartRepo.findOne({ where: { userId } }) : await this.cartRepo.findOne({ where: { guestToken } });
        if (!cart) throw new NotFoundException('Cart not found');

        const item = await this.itemRepo.findOne({ where: { id: dto.itemId, cartId: cart.id }, relations: ['product'] });
        if (!item) throw new NotFoundException('Cart item not found');

        if (dto.quantity === 0) {
            await this.itemRepo.remove(item);
            return this.recalcCart(cart);
        }

        // stock check
        if (item.product.type === 'normal' && item.product.stock < dto.quantity) {
            throw new BadRequestException('Insufficient stock');
        }

        item.quantity = dto.quantity;
        await this.itemRepo.save(item);
        return this.recalcCart(cart);
    }

    async removeItem(itemId: number, userId?: number, guestToken?: string) {
        const cart = userId ? await this.cartRepo.findOne({ where: { userId } }) : await this.cartRepo.findOne({ where: { guestToken } });
        if (!cart) throw new NotFoundException('Cart not found');

        const item = await this.itemRepo.findOne({ where: { id: itemId, cartId: cart.id } });
        if (!item) throw new NotFoundException('Cart item not found');

        await this.itemRepo.remove(item);
        return this.recalcCart(cart);
    }

    async clearCart(userId?: number, guestToken?: string) {
        const cart = userId ? await this.cartRepo.findOne({ where: { userId } }) : await this.cartRepo.findOne({ where: { guestToken } });
        if (!cart) throw new NotFoundException('Cart not found');

        await this.itemRepo.delete({ cartId: cart.id });
        cart.totalPrice = 0;
        cart.totalQty = 0;
        return this.cartRepo.save(cart);
    }
}
