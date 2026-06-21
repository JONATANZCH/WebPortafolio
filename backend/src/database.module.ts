import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

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
      ssl: {
        rejectUnauthorized: false,
      },
      migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
      migrationsRun: true,
    }),
  ],
})
export class DatabaseModule {}
