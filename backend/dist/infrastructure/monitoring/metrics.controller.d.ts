import { Response } from 'express';
import { MetricsService } from './metrics.service';
export declare class MetricsController {
    private readonly metricsService;
    constructor(metricsService: MetricsService);
    getMetrics(res: Response): Promise<void>;
    getBusinessMetrics(): Promise<{
        totalProspectsCreated: number;
        totalProspectsUpdated: number;
        totalProspectsDeleted: number;
        activeProspects: number;
        averageResponseTime: number;
        requestRate: number;
    }>;
    checkAlerts(): Promise<{
        timestamp: string;
        alerts: {
            level: string;
            message: string;
            metric: string;
            value: number;
            threshold: string;
        }[];
        summary: {
            total: number;
            warnings: number;
            critical: number;
        };
    }>;
    getHealthMetrics(): Promise<{
        timestamp: string;
        status: string;
        business: {
            totalProspectsCreated: number;
            totalProspectsUpdated: number;
            totalProspectsDeleted: number;
            activeProspects: number;
            averageResponseTime: number;
            requestRate: number;
        };
        alerts: {
            count: number;
            items: {
                level: string;
                message: string;
                metric: string;
                value: number;
                threshold: string;
            }[];
        };
        system: {
            uptime: number;
            memory: NodeJS.MemoryUsage;
            cpu: NodeJS.CpuUsage;
        };
    }>;
}
