import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    register(userData: {
        email: string;
        name: string;
        password: string;
    }): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
        };
    }>;
    validateJwtPayload(payload: any): Promise<{
        name: string | null;
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        emailVerified: Date | null;
        image: string | null;
        password: string;
        role: import(".prisma/client").$Enums.UserRole;
        linkedin: string | null;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        twoFactorBackupCodes: string | null;
        resetToken: string | null;
        resetTokenExpires: Date | null;
        emailVerificationToken: string | null;
        emailVerificationExpires: Date | null;
        lastLogin: Date | null;
        loginFailures: number;
        accountLocked: boolean;
        accountLockedUntil: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
