import { HealthIndicatorResult } from '@nestjs/terminus';
export declare class HealthService {
    check(): Promise<HealthIndicatorResult>;
}
