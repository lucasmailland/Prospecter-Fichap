"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppLogger = void 0;
const common_1 = require("@nestjs/common");
const winston_1 = require("winston");
const api_1 = require("@opentelemetry/api");
let AppLogger = class AppLogger {
    logger;
    constructor() {
        this.logger = (0, winston_1.createLogger)({
            level: process.env.LOG_LEVEL || 'info',
            format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.json()),
            defaultMeta: { service: 'prospecter-backend' },
            transports: [
                new winston_1.transports.Console(),
            ],
        });
    }
    getTraceId() {
        const span = api_1.trace.getActiveSpan();
        if (span) {
            return span.spanContext().traceId;
        }
        return undefined;
    }
    log(message, ...meta) {
        this.logger.info(message, { traceId: this.getTraceId(), ...meta[0] });
    }
    error(message, trace, ...meta) {
        this.logger.error(message, { traceId: this.getTraceId(), trace, ...meta[0] });
    }
    warn(message, ...meta) {
        this.logger.warn(message, { traceId: this.getTraceId(), ...meta[0] });
    }
    debug(message, ...meta) {
        this.logger.debug(message, { traceId: this.getTraceId(), ...meta[0] });
    }
    verbose(message, ...meta) {
        this.logger.verbose(message, { traceId: this.getTraceId(), ...meta[0] });
    }
};
exports.AppLogger = AppLogger;
exports.AppLogger = AppLogger = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], AppLogger);
//# sourceMappingURL=logger.service.js.map