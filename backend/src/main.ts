import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  // Security: Helmet for HTTP headers
  // CORP cross-origin: lets the browser accept the no-cors pre-warm request to /health.
  // Reads of the API still require the CORS allow-list below.
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

  // CORS configuration based on environment
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? (process.env.FRONTEND_URL || 'https://jonatanzarate.dev')
          .split(',')
          .map((o) => o.trim())
          .filter(Boolean)
      : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Health check endpoint
  app.use('/health', (_req: any, res: any) => {
    res.status(200).json({ status: 'OK' });
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Application is running on port ${port} (${process.env.NODE_ENV || 'development'} mode)`);
}
bootstrap();
