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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracingService = void 0;
const common_1 = require("@nestjs/common");
const nestjs_otel_1 = require("nestjs-otel");
const api_1 = require("@opentelemetry/api");
let TracingService = class TracingService {
    traceService;
    constructor(traceService) {
        this.traceService = traceService;
    }
    createBusinessSpan(operationName, attributes) {
        const span = this.traceService.startSpan(operationName);
        if (attributes) {
            Object.entries(attributes).forEach(([key, value]) => {
                span.setAttribute(key, value);
            });
        }
        span.setAttribute('service.name', 'prospecter-api');
        span.setAttribute('service.version', process.env.npm_package_version || '1.0.0');
        span.setAttribute('environment', process.env.NODE_ENV || 'development');
        return span;
    }
    createDatabaseSpan(operation, table, query) {
        const span = this.createBusinessSpan(`db.${operation}`, {
            'db.operation': operation,
            'db.table': table,
            'db.system': 'postgresql',
        });
        if (query) {
            span.setAttribute('db.statement', query);
        }
        return span;
    }
    createCacheSpan(operation, key) {
        return this.createBusinessSpan(`cache.${operation}`, {
            'cache.operation': operation,
            'cache.key': key,
            'cache.system': 'redis',
        });
    }
    createHttpSpan(method, url, statusCode) {
        const span = this.createBusinessSpan(`http.${method.toLowerCase()}`, {
            'http.method': method,
            'http.url': url,
            'http.scheme': 'http',
        });
        if (statusCode) {
            span.setAttribute('http.status_code', statusCode);
        }
        return span;
    }
    async executeInSpan(operationName, fn, attributes) {
        const span = this.createBusinessSpan(operationName, attributes);
        try {
            const result = await fn();
            span.setStatus({ code: api_1.SpanStatusCode.OK });
            return result;
        }
        catch (error) {
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: error.message,
            });
            span.recordException(error);
            throw error;
        }
        finally {
            span.end();
        }
    }
    getCurrentContext() {
        const span = this.traceService.getSpan();
        if (!span)
            return null;
        const currentSpan = api_1.trace.getActiveSpan();
        if (!currentSpan)
            return null;
        const context = currentSpan.spanContext();
        return {
            traceId: context.traceId,
            spanId: context.spanId,
            correlationId: this.generateCorrelationId(),
        };
    }
    generateCorrelationId() {
        return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    addEvent(name, attributes) {
        const span = this.traceService.getSpan();
        if (span) {
            span.addEvent(name, attributes);
        }
    }
    setAttributes(attributes) {
        const span = this.traceService.getSpan();
        if (span) {
            Object.entries(attributes).forEach(([key, value]) => {
                span.setAttribute(key, value);
            });
        }
    }
    markSuccess() {
        const span = this.traceService.getSpan();
        if (span) {
            span.setStatus({ code: api_1.SpanStatusCode.OK });
        }
    }
    markError(error) {
        const span = this.traceService.getSpan();
        if (span) {
            span.setStatus({
                code: api_1.SpanStatusCode.ERROR,
                message: error.message,
            });
            span.recordException(error);
        }
    }
    createProspectSpan(operation, prospectId) {
        const attributes = {
            'business.operation': operation,
            'business.entity': 'prospect',
        };
        if (prospectId) {
            attributes['business.prospect_id'] = prospectId;
        }
        return this.createBusinessSpan(`prospect.${operation}`, attributes);
    }
    createCampaignSpan(operation, campaignId) {
        const attributes = {
            'business.operation': operation,
            'business.entity': 'campaign',
        };
        if (campaignId) {
            attributes['business.campaign_id'] = campaignId;
        }
        return this.createBusinessSpan(`campaign.${operation}`, attributes);
    }
    createActivitySpan(operation, activityId) {
        const attributes = {
            'business.operation': operation,
            'business.entity': 'prospecting_activity',
        };
        if (activityId) {
            attributes['business.activity_id'] = activityId;
        }
        return this.createBusinessSpan(`activity.${operation}`, attributes);
    }
};
exports.TracingService = TracingService;
exports.TracingService = TracingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof nestjs_otel_1.TraceService !== "undefined" && nestjs_otel_1.TraceService) === "function" ? _a : Object])
], TracingService);
//# sourceMappingURL=tracing.service.js.map