import { LoggerService } from '@nestjs/common';
export declare class AppLogger implements LoggerService {
    private logger;
    constructor();
    private getTraceId;
    log(message: string, ...meta: any[]): void;
    error(message: string, trace?: string, ...meta: any[]): void;
    warn(message: string, ...meta: any[]): void;
    debug(message: string, ...meta: any[]): void;
    verbose(message: string, ...meta: any[]): void;
}
