// src/auth/guards/optional-jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
    // Override the handleRequest method
    handleRequest(err, user, info, context) {
        // This method is called after the token is validated.
        // 'user' will be the user payload if the token is valid, or false/undefined otherwise.
        // Unlike the default AuthGuard, we don't throw an error if the user is not found.
        // We simply return the user object (or null/undefined) to be attached to the request.
        return user;
    }
}