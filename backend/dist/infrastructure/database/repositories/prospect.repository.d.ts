import { Repository } from 'typeorm';
import { Prospect, ProspectStatus } from '../../../domain/entities/prospect.entity';
import { IProspectRepository } from '../../../domain/repositories/prospect.repository.interface';
import { CacheService } from '../../cache/cache.service';
import { AppLogger } from '../../performance/logger.service';
import { TracingService } from '../../tracing/tracing.service';
export declare class ProspectRepository implements IProspectRepository {
    private readonly prospectRepository;
    private readonly cacheService;
    private readonly logger;
    private readonly tracingService;
    constructor(prospectRepository: Repository<Prospect>, cacheService: CacheService, logger: AppLogger, tracingService: TracingService);
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
