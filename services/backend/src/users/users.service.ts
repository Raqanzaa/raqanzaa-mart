// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Role } from './role.enum';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private repo: Repository<User>,
    ) { }

    findById(id: string) {
        return this.repo.findOne({ where: { id } });
    }

    findByEmail(email: string) {
        if (!email) return Promise.resolve(null);
        return this.repo.findOne({ where: { email } });
    }

    findByGoogleId(googleId: string) {
        if (!googleId) return Promise.resolve(null);
        return this.repo.findOne({ where: { googleId } });
    }

    async create(data: Partial<User>) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const u = this.repo.create(data);
        return this.repo.save(u);
    }

    async findOrCreateFromGoogle(profile: any) {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        let user = await this.findByGoogleId(googleId);
        if (!user && email) user = await this.findByEmail(email);
        if (user) {
            // attach googleId if missing
            if (!user.googleId) {
                user.googleId = googleId;
                return this.repo.save(user);
            }
            return user;
        }
        const newUser = this.repo.create({
            email: email || null,
            googleId,
            name: profile.displayName || email,
            role: Role.CUSTOMER,
        });
        return this.repo.save(newUser);
    }
}
