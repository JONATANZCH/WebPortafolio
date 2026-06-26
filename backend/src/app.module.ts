import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { DatabaseModule } from './database.module.js';
import { ContactModule } from './contact/contact.module.js';
import { I18nModule } from './i18n/i18n.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.local',
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }], // Global: 100 requests per minute
    }),
    I18nModule,
    DatabaseModule,
    ContactModule,
  ],
})
export class AppModule {}
