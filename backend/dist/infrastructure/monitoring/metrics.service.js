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
exports.MetricsService = void 0;
const common_1 = require("@nestjs/common");
const prom_client_1 = require("prom-client");
let MetricsService = class MetricsService {
    registry;
    prospectsCreatedTotal;
    prospectsUpdatedTotal;
    prospectsDeletedTotal;
    activeProspectsGauge;
    databaseConnectionsActive;
    redisConnectionsActive;
    memoryUsageBytes;
    cpuUsagePercent;
    httpRequestsTotal;
    httpRequestDuration;
    constructor() {
        this.registry = new prom_client_1.Registry();
        this.prospectsCreatedTotal = new prom_client_1.Counter({
            name: 'prospects_created_total',
            help: 'Total number of prospects created',
            labelNames: ['status'],
            registers: [this.registry],
        });
        this.prospectsUpdatedTotal = new prom_client_1.Counter({
            name: 'prospects_updated_total',
            help: 'Total number of prospects updated',
            labelNames: ['status'],
            registers: [this.registry],
        });
        this.prospectsDeletedTotal = new prom_client_1.Counter({
            name: 'prospects_deleted_total',
            help: 'Total number of prospects deleted',
            labelNames: ['status'],
            registers: [this.registry],
        });
        this.activeProspectsGauge = new prom_client_1.Gauge({
            name: 'active_prospects_gauge',
            help: 'Current number of active prospects',
            registers: [this.registry],
        });
        this.databaseConnectionsActive = new prom_client_1.Gauge({
            name: 'database_connections_active',
            help: 'Number of active database connections',
            registers: [this.registry],
        });
        this.redisConnectionsActive = new prom_client_1.Gauge({
            name: 'redis_connections_active',
            help: 'Number of active Redis connections',
            registers: [this.registry],
        });
        this.memoryUsageBytes = new prom_client_1.Gauge({
            name: 'memory_usage_bytes',
            help: 'Current memory usage in bytes',
            registers: [this.registry],
        });
        this.cpuUsagePercent = new prom_client_1.Gauge({
            name: 'cpu_usage_percent',
            help: 'Current CPU usage percentage',
            registers: [this.registry],
        });
        this.httpRequestsTotal = new prom_client_1.Counter({
            name: 'http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'path', 'status_code'],
            registers: [this.registry],
        });
        this.httpRequestDuration = new prom_client_1.Histogram({
            name: 'http_request_duration_seconds',
            help: 'HTTP request duration in seconds',
            labelNames: ['method', 'path'],
            buckets: [0.1, 0.5, 1, 2, 5],
            registers: [this.registry],
        });
    }
    recordProspectCreated(status = 'success') {
        this.prospectsCreatedTotal.inc({ status });
    }
    recordProspectUpdated(status = 'success') {
        this.prospectsUpdatedTotal.inc({ status });
    }
    recordProspectDeleted(status = 'success') {
        this.prospectsDeletedTotal.inc({ status });
    }
    setActiveProspectsCount(count) {
        this.activeProspectsGauge.set(count);
    }
    setDatabaseConnectionsActive(count) {
        this.databaseConnectionsActive.set(count);
    }
    setRedisConnectionsActive(count) {
        this.redisConnectionsActive.set(count);
    }
    setMemoryUsage(bytes) {
        this.memoryUsageBytes.set(bytes);
    }
    setCpuUsage(percent) {
        this.cpuUsagePercent.set(percent);
    }
    recordHttpRequest(method, path, statusCode, duration) {
        this.httpRequestsTotal.inc({ method, path, status_code: statusCode.toString() });
        this.httpRequestDuration.observe({ method, path }, duration);
    }
    async checkAlertThresholds() {
        const metrics = await this.registry.getMetricsAsJSON();
        const alerts = [];
        const memoryUsage = metrics.find(m => m.name === 'memory_usage_bytes');
        if (memoryUsage && memoryUsage.values && memoryUsage.values[0]?.value > 0.9 * 1024 * 1024 * 1024) {
            alerts.push({
                level: 'warning',
                message: 'High memory usage detected',
                metric: 'memory_usage_bytes',
                value: memoryUsage.values[0].value,
                threshold: '90%'
            });
        }
        const cpuUsage = metrics.find(m => m.name === 'cpu_usage_percent');
        if (cpuUsage && cpuUsage.values && cpuUsage.values[0]?.value > 80) {
            alerts.push({
                level: 'warning',
                message: 'High CPU usage detected',
                metric: 'cpu_usage_percent',
                value: cpuUsage.values[0].value,
                threshold: '80%'
            });
        }
        const dbConnections = metrics.find(m => m.name === 'database_connections_active');
        if (dbConnections && dbConnections.values && dbConnections.values[0]?.value > 80) {
            alerts.push({
                level: 'critical',
                message: 'High database connections detected',
                metric: 'database_connections_active',
                value: dbConnections.values[0].value,
                threshold: '80'
            });
        }
        return alerts;
    }
    async getBusinessMetrics() {
        const metrics = await this.registry.getMetricsAsJSON();
        return {
            totalProspectsCreated: this.getMetricValue(metrics, 'prospects_created_total'),
            totalProspectsUpdated: this.getMetricValue(metrics, 'prospects_updated_total'),
            totalProspectsDeleted: this.getMetricValue(metrics, 'prospects_deleted_total'),
            activeProspects: this.getMetricValue(metrics, 'active_prospects_gauge'),
            averageResponseTime: this.calculateAverageResponseTime(metrics),
            requestRate: this.calculateRequestRate(metrics),
        };
    }
    getMetricValue(metrics, metricName) {
        const metric = metrics.find(m => m.name === metricName);
        return metric && metric.values && metric.values[0] ? metric.values[0].value : 0;
    }
    calculateAverageResponseTime(metrics) {
        const durationMetric = metrics.find(m => m.name === 'http_request_duration_seconds');
        return durationMetric && durationMetric.values && durationMetric.values[0] ? durationMetric.values[0].value : 0;
    }
    calculateRequestRate(metrics) {
        const requestsMetric = metrics.find(m => m.name === 'http_requests_total');
        return requestsMetric && requestsMetric.values && requestsMetric.values[0] ? requestsMetric.values[0].value : 0;
    }
    async getMetrics() {
        return await this.registry.metrics();
    }
};
exports.MetricsService = MetricsService;
exports.MetricsService = MetricsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], MetricsService);
//# sourceMappingURL=metrics.service.js.map