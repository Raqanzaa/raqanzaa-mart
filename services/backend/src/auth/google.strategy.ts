// src/auth/google.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private cfg: ConfigService, private usersService: UsersService) {
        super({
            clientID: cfg.get('GOOGLE_CLIENT_ID'),
            clientSecret: cfg.get('GOOGLE_CLIENT_SECRET'),
            callbackURL: cfg.get('GOOGLE_CALLBACK_URL'),
            scope: ['email', 'profile'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        // profile contains id, displayName, emails, photos
        const user = await this.usersService.findOrCreateFromGoogle(profile);
        return user; // attached as req.user by Passport
    }
}
