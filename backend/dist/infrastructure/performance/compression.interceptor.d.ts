import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
export declare class CompressionInterceptor implements NestInterceptor {
    private compression;
    intercept(context: ExecutionContext, next: CallHandler): Observable<any>;
}
