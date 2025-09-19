// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private jwtService: JwtService) { }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        if (!user.password) throw new UnauthorizedException('Password login not available for this user');
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new UnauthorizedException('Invalid credentials');
        return user;
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return { access_token: this.jwtService.sign(payload) };
    }

    async register(data: { email: string; password: string; name?: string }) {
        const existing = await this.usersService.findByEmail(data.email);
        if (existing) throw new Error('Email already used');
        const user = await this.usersService.create({ email: data.email, password: data.password, name: data.name });
        return this.login(user);
    }
}
