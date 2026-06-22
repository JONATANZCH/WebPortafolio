import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
import serverless from 'serverless-http';
import type { INestApplication } from '@nestjs/common';

let cachedHandler: ReturnType<typeof serverless> | null = null;

async function bootstrapApp(): Promise<ReturnType<typeof serverless>> {
  if (cachedHandler) return cachedHandler;

  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL]
    : ['http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use('/health', (_req: any, res: any) => {
    res.json({ status: 'OK' });
  });

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  cachedHandler = serverless(expressApp);
  return cachedHandler;
}

export const handler = async (event: any, context: any): Promise<any> => {
  const handle = await bootstrapApp();
  return handle(event, context);
};
