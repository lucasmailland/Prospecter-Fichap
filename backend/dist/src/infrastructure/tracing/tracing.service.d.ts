import { TraceService } from 'nestjs-otel';
import { Span } from '@opentelemetry/api';
export interface TracingContext {
    traceId: string;
    spanId: string;
    correlationId: string;
}
export declare class TracingService {
    private readonly traceService;
    constructor(traceService: TraceService);
    createBusinessSpan(operationName: string, attributes?: Record<string, any>): Span;
    createDatabaseSpan(operation: string, table: string, query?: string): Span;
    createCacheSpan(operation: string, key: string): Span;
    createHttpSpan(method: string, url: string, statusCode?: number): Span;
    executeInSpan<T>(operationName: string, fn: () => Promise<T>, attributes?: Record<string, any>): Promise<T>;
    getCurrentContext(): TracingContext | null;
    generateCorrelationId(): string;
    addEvent(name: string, attributes?: Record<string, any>): void;
    setAttributes(attributes: Record<string, any>): void;
    markSuccess(): void;
    markError(error: Error): void;
    createProspectSpan(operation: string, prospectId?: number): Span;
    createCampaignSpan(operation: string, campaignId?: number): Span;
    createActivitySpan(operation: string, activityId?: number): Span;
}
