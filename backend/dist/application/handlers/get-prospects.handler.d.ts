import { GetProspectByIdQuery, GetProspectStatsQuery } from '../queries/get-prospects.query';
import { IProspectRepository } from '../../domain/repositories/prospect.repository.interface';
import { ProspectResponseDto } from '../dto/prospect.dto';
export declare class GetProspectsHandler {
    private readonly prospectRepository;
    constructor(prospectRepository: IProspectRepository);
    execute(page?: number, limit?: number): Promise<{
        data: import("../../domain/entities").Prospect[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    executeById(query: GetProspectByIdQuery): Promise<ProspectResponseDto | null>;
    executeStats(query: GetProspectStatsQuery): Promise<{
        total: number;
        byStatus: Record<import("../../domain/entities").ProspectStatus, number>;
        byIndustry: Record<string, number>;
        conversionRate: number;
    }>;
    private toResponseDto;
}
