import { ProspectStatus } from '../../domain/entities/prospect.entity';
export declare class CreateProspectDto {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    position?: string;
    linkedin_url?: string;
    website?: string;
    industry?: string;
    status?: ProspectStatus;
    source?: string;
    notes?: string;
}
export declare class UpdateProspectDto {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    position?: string;
    linkedin_url?: string;
    website?: string;
    industry?: string;
    status?: ProspectStatus;
    source?: string;
    notes?: string;
}
export declare class ProspectFiltersDto {
    status?: ProspectStatus;
    industry?: string;
    company?: string;
    createdAfter?: string;
    createdBefore?: string;
}
export declare class PaginationDto {
    page?: number;
    limit?: number;
}
export declare class ProspectResponseDto {
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
}
export declare class PaginatedProspectsResponseDto {
    data: ProspectResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
