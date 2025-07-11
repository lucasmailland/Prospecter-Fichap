import { UsersService } from './users.service';
import { User } from '@prisma/client';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
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
    }[]>;
    findById(id: string): Promise<{
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
    create(userData: {
        email: string;
        name?: string;
        password: string;
        role?: string;
    }): Promise<{
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
    update(id: string, userData: Partial<User>): Promise<{
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
    delete(id: string): Promise<void>;
}
