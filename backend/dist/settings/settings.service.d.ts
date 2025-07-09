import { PrismaService } from '@/common/database/prisma.service';
export declare class SettingsService {
    private prisma;
    constructor(prisma: PrismaService);
    getSettings(): Promise<{
        description: string | null;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        key: string;
        value: string;
        isEncrypted: boolean;
        isEditable: boolean;
        validationRegex: string | null;
        defaultValue: string | null;
        lastModifiedBy: string | null;
    }[]>;
    updateSetting(key: string, value: string): Promise<{
        description: string | null;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        category: string;
        key: string;
        value: string;
        isEncrypted: boolean;
        isEditable: boolean;
        validationRegex: string | null;
        defaultValue: string | null;
        lastModifiedBy: string | null;
    }>;
}
