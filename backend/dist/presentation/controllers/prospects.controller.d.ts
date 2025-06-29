import { CreateProspectDto } from '../../application/dto/prospect.dto';
import { CreateProspectHandler } from '../../application/handlers/create-prospect.handler';
import { GetProspectsHandler } from '../../application/handlers/get-prospects.handler';
import { IProspectRepository } from '../../domain/repositories/prospect.repository.interface';
import { AppLogger } from '../../infrastructure/performance/logger.service';
import { TraceService } from 'nestjs-otel';
import { MetricsService } from '../../infrastructure/monitoring/metrics.service';
export declare class ProspectsController {
    private readonly createProspectHandler;
    private readonly getProspectsHandler;
    private readonly prospectRepository;
    private readonly logger;
    private readonly traceService;
    private readonly metricsService;
    constructor(createProspectHandler: CreateProspectHandler, getProspectsHandler: GetProspectsHandler, prospectRepository: IProspectRepository, logger: AppLogger, traceService: TraceService, metricsService: MetricsService);
    create(createProspectDto: CreateProspectDto): Promise<import("../../domain/entities").Prospect>;
    findAll(page?: number, limit?: number): Promise<{
        data: import("../../domain/entities").Prospect[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getStats(): Promise<{
        total: number;
        byStatus: Record<import("../../domain/entities").ProspectStatus, number>;
        byIndustry: Record<string, number>;
        conversionRate: number;
    }>;
    findOne(id: number): Promise<import("../../domain/entities").Prospect>;
    update(id: number, updateProspectDto: Partial<CreateProspectDto>): Promise<import("../../domain/entities").Prospect>;
    remove(id: number): Promise<void>;
}
