import { Prospect, ProspectStatus } from '../entities/prospect.entity';
export declare const PROSPECT_REPOSITORY = "PROSPECT_REPOSITORY";
export interface IProspectRepository {
    create(prospect: Partial<Prospect>): Promise<Prospect>;
    findById(id: number): Promise<Prospect | null>;
    findAll(page?: number, limit?: number): Promise<{
        data: Prospect[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    update(id: number, updateData: Partial<Prospect>): Promise<Prospect | null>;
    delete(id: number): Promise<boolean>;
    findByEmail(email: string): Promise<Prospect | null>;
    findByCompany(company: string): Promise<Prospect[]>;
    findByStatus(status: ProspectStatus): Promise<Prospect[]>;
    findByIndustry(industry: string): Promise<Prospect[]>;
    findWithPagination(page: number, limit: number): Promise<{
        data: Prospect[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    search(query: string): Promise<Prospect[]>;
    findByFilters(filters: {
        status?: ProspectStatus;
        industry?: string;
        company?: string;
        createdAfter?: Date;
        createdBefore?: Date;
    }): Promise<Prospect[]>;
    getStats(): Promise<{
        total: number;
        byStatus: Record<ProspectStatus, number>;
        byIndustry: Record<string, number>;
        conversionRate: number;
    }>;
}
