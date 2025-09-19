// src/auth/auth.controller.ts
import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() body: { email: string; password: string; name?: string }) {
        return this.authService.register(body);
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const user = await this.authService.validateUser(body.email, body.password);
        return this.authService.login(user);
    }

    // Redirect to Google for authentication
    @Get('google')
    @UseGuards(AuthGuard('google'))
    async googleAuth() {
        // initiates OAuth2 login flow
    }

    // Google will redirect here after consent
    @Get('google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req: any) {
        // req.user is the user returned from GoogleStrategy.validate
        return this.authService.login(req.user);
    }
}
