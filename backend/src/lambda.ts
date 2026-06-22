import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import type { INestApplication } from '@nestjs/common';

let cachedApp: INestApplication | null = null;

async function bootstrapApp(): Promise<INestApplication> {
  if (cachedApp) {
    return cachedApp;
  }

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'https://jonatanzarate.dev'],
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

  cachedApp = app;
  return app;
}

export const handler = async (event: any, context: any): Promise<any> => {
  const app = await bootstrapApp();
  const expressApp = app.getHttpAdapter().getInstance();

  return new Promise((resolve, reject) => {
    const { createServer, proxy } = require('aws-serverless-express');
    const server = createServer(expressApp);
    context.callbackWaitsForEmptyEventLoop = false;
    proxy(server, event, context, 'PROMISE').promise.then(resolve).catch(reject);
  });
};
