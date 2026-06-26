import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ContactMessage } from './contact.entity.js';
import { ContactService } from './contact.service.js';
import { ContactController } from './contact.controller.js';
import { I18nModule } from '../i18n/i18n.module.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactMessage]),
    ConfigModule,
    I18nModule,
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
