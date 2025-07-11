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
        id: string;
        firstName: string;
        lastName: string;
        name: string;
        email: string;
        emailVerified: Date;
        role: import(".prisma/client").$Enums.UserRole;
        twoFactorEnabled: boolean;
        lastLogin: Date;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
