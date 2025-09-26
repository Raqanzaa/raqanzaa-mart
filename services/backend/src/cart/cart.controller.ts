// src/cart/cart.controller.ts
import {
    Controller,
    Post,
    Body,
    Get,
    Req,
    UseGuards, // <-- Import
    Patch,
    Delete,
    Param,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { Request } from 'express';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard'; // <-- Import your new guard

@Controller('cart')
@UseGuards(OptionalJwtAuthGuard) // <-- Apply the guard to the ENTIRE controller
export class CartController {
    constructor(private readonly cartService: CartService) { }

    // This method is now secure.
    // req.user is populated by the guard ONLY if the JWT is valid.
    // Otherwise, req.user is undefined.
    private extractIdentity(req: Request) {
        const userId = (req as any).user?.sub;  // Use 'sub' or 'id' from your JWT payload
        const guestToken = req.headers['x-guest-token'] as string | undefined;
        return { userId, guestToken };
    }

    @Post('add')
    async addToCart(@Body() dto: AddToCartDto, @Req() req: Request) {
        const { userId, guestToken } = this.extractIdentity(req);
        const cart = await this.cartService.addToCart(dto, userId, guestToken);

        // This logic remains the same
        if (!userId && cart.guestToken && !guestToken) {
            return { cart, guestToken: cart.guestToken };
        }
        return { cart };
    }

    @Get()
    async getCart(@Req() req: Request) {
        const { userId, guestToken } = this.extractIdentity(req);
        // Find or create a cart for the user/guest
        const cart = await this.cartService.findOrCreateCartForUser(
            userId,
            guestToken,
        );
        return { cart };
    }

    @Patch('item')
    async updateItem(@Body() dto: UpdateCartItemDto, @Req() req: Request) {
        const { userId, guestToken } = this.extractIdentity(req);
        const cart = await this.cartService.updateItem(dto, userId, guestToken);
        return { cart };
    }

    @Delete('item/:id')
    async removeItem(@Param('id') id: string, @Req() req: Request) {
        const { userId, guestToken } = this.extractIdentity(req);
        const cart = await this.cartService.removeItem(Number(id), userId, guestToken);
        return { cart };
    }

    @Delete()
    async clear(@Req() req: Request) {
        const { userId, guestToken } = this.extractIdentity(req);
        const cart = await this.cartService.clearCart(userId, guestToken);
        return { cart };
    }
}