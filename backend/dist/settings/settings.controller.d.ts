import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
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
    updateSetting(key: string, data: {
        value: string;
    }): Promise<{
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
