import { ProspectFiltersDto, PaginationDto } from '../dto/prospect.dto';
export declare class GetProspectsQuery {
    readonly filters: ProspectFiltersDto;
    readonly pagination: PaginationDto;
    constructor(filters: ProspectFiltersDto, pagination: PaginationDto);
}
export declare class GetProspectByIdQuery {
    readonly id: number;
    constructor(id: number);
}
export declare class GetProspectStatsQuery {
    constructor();
}
