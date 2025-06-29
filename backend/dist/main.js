"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const nest_winston_1 = require("nest-winston");
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
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map