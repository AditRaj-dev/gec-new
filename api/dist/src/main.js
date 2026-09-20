"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const logging_interceptor_1 = require("./common/interceptors/logging.interceptor");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const port = configService.get('app.port') || 4000;
    const corsOrigins = configService.get('app.corsOrigins') || [
        'http://localhost:3000',
        'http://localhost:3001',
    ];
    app.use(cookieParser());
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            if (corsOrigins.includes(origin) || corsOrigins.includes('*')) {
                return callback(null, true);
            }
            return callback(new Error(`Origin ${origin} not permitted by CORS policy`), false);
        },
        credentials: true,
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'Idempotency-Key',
            'If-Match',
            'X-Request-Id',
        ],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionsFilter());
    app.useGlobalInterceptors(new logging_interceptor_1.LoggingInterceptor());
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Galgotias Entrepreneurship Cell (GEC) API')
        .setDescription('Core REST API modular monolith for GEC Public Website, CMS, Gemini Copilot, and Google Forms integration.')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(port, '0.0.0.0');
    logger.log(`GEC Backend API is running on http://0.0.0.0:${port}`);
    logger.log(`API documentation available at http://0.0.0.0:${port}/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map