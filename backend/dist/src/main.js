"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const nest_winston_1 = require("nest-winston");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        bufferLogs: true,
        logger: nest_winston_1.WinstonModule.createLogger({
            transports: [
                new (require('winston').transports.Console)(),
            ],
            format: require('winston').format.combine(require('winston').format.timestamp(), require('winston').format.errors({ stack: true }), require('winston').format.splat(), require('winston').format.json()),
            defaultMeta: { service: 'prospecter-backend' },
        }),
    });
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Prospecter API')
        .setDescription('API pública y privada para gestión de prospectos, campañas y actividades. Incluye autenticación, métricas, health y tracing.')
        .setVersion('1.0.0')
        .addBearerAuth()
        .addTag('Prospects', 'Gestión de prospectos')
        .addTag('Metrics', 'Métricas y observabilidad')
        .addTag('Health', 'Healthchecks y estado')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'list',
            displayRequestDuration: true,
        },
        customSiteTitle: 'Prospecter API Docs',
    });
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map