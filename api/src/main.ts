import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 4000;
  const corsOrigins = configService.get<string[]>('app.corsOrigins') || [
    'http://localhost:3000',
    'http://localhost:3001',
  ];

  // Cookie parser for HttpOnly refresh tokens
  app.use(cookieParser());

  // Strict CORS policy matching architecture.md section 9.3
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
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

  // Global filters, interceptors, and pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('Galgotias Entrepreneurship Cell (GEC) API')
    .setDescription(
      'Core REST API modular monolith for GEC Public Website, CMS, Gemini Copilot, and Google Forms integration.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Bind to 0.0.0.0 for Render compatibility
  await app.listen(port, '0.0.0.0');
  logger.log(`GEC Backend API is running on http://0.0.0.0:${port}`);
  logger.log(`API documentation available at http://0.0.0.0:${port}/docs`);
}

bootstrap();
