import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private authService;
    constructor(configService: ConfigService, authService: AuthService);
    validate(payload: any): Promise<{
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
export {};
