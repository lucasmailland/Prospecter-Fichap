import { CampaignProspect } from './campaign-prospect.entity';
export declare enum CampaignStatus {
    ACTIVE = "active",
    PAUSED = "paused",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
export declare class Campaign {
    id: number;
    name: string;
    description: string;
    status: CampaignStatus;
    target_industry: string;
    target_position: string;
    created_at: Date;
    updated_at: Date;
    campaignProspects: CampaignProspect[];
}
