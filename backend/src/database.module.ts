import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: '.env.local' });
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // Explicitly disable synchronize in production — only allow in development
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
      // Verify the server certificate in production. Escape hatch (not recommended):
      // set DATABASE_SSL_INSECURE=true for a host that uses a self-signed certificate.
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: process.env.DATABASE_SSL_INSECURE !== 'true' }
          : false,
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: true,
    }),
  ],
})
export class DatabaseModule {}
