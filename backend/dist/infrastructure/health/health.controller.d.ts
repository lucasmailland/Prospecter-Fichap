import { HealthCheckService, TypeOrmHealthIndicator, MemoryHealthIndicator, DiskHealthIndicator } from '@nestjs/terminus';
import { Counter } from 'prom-client';
export declare class HealthController {
    private health;
    private db;
    private memory;
    private disk;
    private readonly healthCheckCounter;
    constructor(health: HealthCheckService, db: TypeOrmHealthIndicator, memory: MemoryHealthIndicator, disk: DiskHealthIndicator, healthCheckCounter: Counter<string>);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    ready(): Promise<import("@nestjs/terminus").HealthCheckResult>;
    live(): Promise<import("@nestjs/terminus").HealthCheckResult>;
}
