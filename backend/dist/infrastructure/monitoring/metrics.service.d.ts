export declare class MetricsService {
    private readonly registry;
    private readonly prospectsCreatedTotal;
    private readonly prospectsUpdatedTotal;
    private readonly prospectsDeletedTotal;
    private readonly activeProspectsGauge;
    private readonly databaseConnectionsActive;
    private readonly redisConnectionsActive;
    private readonly memoryUsageBytes;
    private readonly cpuUsagePercent;
    private readonly httpRequestsTotal;
    private readonly httpRequestDuration;
    constructor();
    recordProspectCreated(status?: string): void;
    recordProspectUpdated(status?: string): void;
    recordProspectDeleted(status?: string): void;
    setActiveProspectsCount(count: number): void;
    setDatabaseConnectionsActive(count: number): void;
    setRedisConnectionsActive(count: number): void;
    setMemoryUsage(bytes: number): void;
    setCpuUsage(percent: number): void;
    recordHttpRequest(method: string, path: string, statusCode: number, duration: number): void;
    checkAlertThresholds(): Promise<{
        level: string;
        message: string;
        metric: string;
        value: number;
        threshold: string;
    }[]>;
    getBusinessMetrics(): Promise<{
        totalProspectsCreated: number;
        totalProspectsUpdated: number;
        totalProspectsDeleted: number;
        activeProspects: number;
        averageResponseTime: number;
        requestRate: number;
    }>;
    private getMetricValue;
    private calculateAverageResponseTime;
    private calculateRequestRate;
    getMetrics(): Promise<string>;
}
