import { Campaign, CampaignStatus } from '../entities/campaign.entity';
import { Prospect } from '../entities/prospect.entity';
export interface ICampaignRepository {
    create(campaign: Partial<Campaign>): Promise<Campaign>;
    findById(id: number): Promise<Campaign | null>;
    findAll(): Promise<Campaign[]>;
    update(id: number, campaign: Partial<Campaign>): Promise<Campaign>;
    delete(id: number): Promise<void>;
    findByStatus(status: CampaignStatus): Promise<Campaign[]>;
    findByIndustry(industry: string): Promise<Campaign[]>;
    addProspectToCampaign(campaignId: number, prospectId: number): Promise<void>;
    removeProspectFromCampaign(campaignId: number, prospectId: number): Promise<void>;
    getProspectsInCampaign(campaignId: number): Promise<Prospect[]>;
    findWithPagination(page: number, limit: number): Promise<{
        data: Campaign[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getCampaignStats(campaignId: number): Promise<{
        totalProspects: number;
        prospectsByStatus: Record<string, number>;
        conversionRate: number;
        averageResponseTime: number;
    }>;
    search(query: string): Promise<Campaign[]>;
    findByFilters(filters: {
        status?: CampaignStatus;
        industry?: string;
        createdAfter?: Date;
        createdBefore?: Date;
    }): Promise<Campaign[]>;
}
