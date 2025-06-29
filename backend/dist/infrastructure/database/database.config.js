"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatabaseConfig = void 0;
const getDatabaseConfig = (configService) => ({
    type: 'postgres',
    host: configService.get('DB_HOST', 'postgres'),
    port: configService.get('DB_PORT', 5432),
    username: configService.get('DB_USERNAME', 'prospecter_user'),
    password: configService.get('DB_PASSWORD', 'prospecter_password'),
    database: configService.get('DB_NAME', 'prospecter_db'),
    extra: {
        connectionLimit: configService.get('DB_CONNECTION_LIMIT', 10),
        acquireTimeout: configService.get('DB_ACQUIRE_TIMEOUT', 60000),
        timeout: configService.get('DB_TIMEOUT', 60000),
        idleTimeout: configService.get('DB_IDLE_TIMEOUT', 30000),
    },
    synchronize: configService.get('NODE_ENV') !== 'production',
    logging: configService.get('NODE_ENV') === 'development',
    ssl: configService.get('NODE_ENV') === 'production'
        ? { rejectUnauthorized: false }
        : false,
    cache: {
        duration: 30000,
    },
    maxQueryExecutionTime: 1000,
    migrations: ['dist/migrations/*.js'],
    migrationsRun: configService.get('NODE_ENV') === 'production',
    entities: ['dist/**/*.entity{.ts,.js}'],
    subscribers: ['dist/**/*.subscriber{.ts,.js}'],
});
exports.getDatabaseConfig = getDatabaseConfig;
//# sourceMappingURL=database.config.js.map