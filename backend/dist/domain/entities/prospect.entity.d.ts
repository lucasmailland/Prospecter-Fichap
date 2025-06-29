import { ProspectingActivity } from './prospecting-activity.entity';
import { CampaignProspect } from './campaign-prospect.entity';
export declare enum ProspectStatus {
    NEW = "new",
    CONTACTED = "contacted",
    INTERESTED = "interested",
    QUALIFIED = "qualified",
    CONVERTED = "converted",
    LOST = "lost"
}
export declare class Prospect {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    position?: string;
    linkedin_url?: string;
    website?: string;
    industry?: string;
    status: ProspectStatus;
    source?: string;
    notes?: string;
    hubspot_id?: string;
    created_at: Date;
    updated_at: Date;
    activities: ProspectingActivity[];
    campaignProspects: CampaignProspect[];
}
