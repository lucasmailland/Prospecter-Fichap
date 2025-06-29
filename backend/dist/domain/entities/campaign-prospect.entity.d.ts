import { Campaign } from './campaign.entity';
import { Prospect } from './prospect.entity';
export declare class CampaignProspect {
    id: number;
    campaign_id: number;
    prospect_id: number;
    added_at: Date;
    campaign: Campaign;
    prospect: Prospect;
}
