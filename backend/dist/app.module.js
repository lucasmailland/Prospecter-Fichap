"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const bull_1 = require("@nestjs/bull");
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const nestjs_prometheus_1 = require("@willsoto/nestjs-prometheus");
const nestjs_otel_1 = require("nestjs-otel");
const prospect_entity_1 = require("./domain/entities/prospect.entity");
const campaign_entity_1 = require("./domain/entities/campaign.entity");
const prospecting_activity_entity_1 = require("./domain/entities/prospecting-activity.entity");
const campaign_prospect_entity_1 = require("./domain/entities/campaign-prospect.entity");
const system_config_entity_1 = require("./domain/entities/system-config.entity");
const database_module_1 = require("./infrastructure/database/database.module");
const cache_module_1 = require("./infrastructure/cache/cache.module");
const health_module_1 = require("./infrastructure/health/health.module");
const compression_module_1 = require("./infrastructure/performance/compression.module");
const metrics_module_1 = require("./infrastructure/monitoring/metrics.module");
const tracing_module_1 = require("./infrastructure/tracing/tracing.module");
const create_prospect_handler_1 = require("./application/handlers/create-prospect.handler");
const get_prospects_handler_1 = require("./application/handlers/get-prospects.handler");
const prospects_controller_1 = require("./presentation/controllers/prospects.controller");
const prospect_repository_1 = require("./infrastructure/database/repositories/prospect.repository");
const logger_service_1 = require("./infrastructure/performance/logger.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'postgres'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'prospecter_user'),
                    password: configService.get('DB_PASSWORD', 'prospecter_password'),
                    database: configService.get('DB_NAME', 'prospecter_db'),
                    entities: [prospect_entity_1.Prospect, campaign_entity_1.Campaign, prospecting_activity_entity_1.ProspectingActivity, campaign_prospect_entity_1.CampaignProspect, system_config_entity_1.SystemConfig],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    logging: configService.get('NODE_ENV') === 'development',
                    ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
                }),
                inject: [config_1.ConfigService],
            }),
            database_module_1.DatabaseModule,
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST', 'redis'),
                        port: configService.get('REDIS_PORT', 6379),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                    defaultJobOptions: {
                        removeOnComplete: 100,
                        removeOnFail: 50,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            cache_module_1.RedisCacheModule,
            health_module_1.HealthModule,
            compression_module_1.CompressionModule,
            metrics_module_1.MetricsModule,
            tracing_module_1.TracingModule,
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            nestjs_prometheus_1.PrometheusModule.register({
                path: '/metrics',
                defaultMetrics: { enabled: true },
            }),
            nestjs_otel_1.OpenTelemetryModule.forRoot({
                metrics: {
                    hostMetrics: true,
                    apiMetrics: {
                        enable: true,
                    },
                },
            }),
        ],
        controllers: [
            app_controller_1.AppController,
            prospects_controller_1.ProspectsController,
        ],
        providers: [
            app_service_1.AppService,
            create_prospect_handler_1.CreateProspectHandler,
            get_prospects_handler_1.GetProspectsHandler,
            {
                provide: 'PROSPECT_REPOSITORY',
                useClass: prospect_repository_1.ProspectRepository,
            },
            {
                provide: (0, typeorm_1.getRepositoryToken)(prospect_entity_1.Prospect),
                useClass: prospect_repository_1.ProspectRepository,
            },
            logger_service_1.AppLogger,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map