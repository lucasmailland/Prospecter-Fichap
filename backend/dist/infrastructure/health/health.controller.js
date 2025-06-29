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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const terminus_1 = require("@nestjs/terminus");
const swagger_1 = require("@nestjs/swagger");
const prom_client_1 = require("prom-client");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
let HealthController = class HealthController {
    health;
    db;
    memory;
    disk;
    healthCheckCounter;
    constructor(health, db, memory, disk, healthCheckCounter) {
        this.health = health;
        this.db = db;
        this.memory = memory;
        this.disk = disk;
        this.healthCheckCounter = healthCheckCounter;
    }
    check() {
        this.healthCheckCounter.inc();
        return this.health.check([
            () => this.db.pingCheck('database'),
            () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
            () => this.disk.checkStorage('storage', { thresholdPercent: 0.9, path: '/' }),
        ]);
    }
    ready() {
        return this.health.check([
            () => this.db.pingCheck('database'),
        ]);
    }
    live() {
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
        ]);
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check application health' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application is healthy',
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'Application is unhealthy',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('ready'),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check if application is ready to receive traffic' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application is ready',
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'Application is not ready',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "ready", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check if application is alive' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Application is alive',
    }),
    (0, swagger_1.ApiResponse)({
        status: 503,
        description: 'Application is not alive',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "live", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __param(4, (0, nestjs_prometheus_1.InjectMetric)('health_check_counter')),
    __metadata("design:paramtypes", [terminus_1.HealthCheckService,
        terminus_1.TypeOrmHealthIndicator,
        terminus_1.MemoryHealthIndicator,
        terminus_1.DiskHealthIndicator,
        prom_client_1.Counter])
], HealthController);
//# sourceMappingURL=health.controller.js.map