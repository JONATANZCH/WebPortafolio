import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ContactMessage } from './contact.entity.js';
import { ContactService } from './contact.service.js';
import { ContactController } from './contact.controller.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactMessage]),
    ConfigModule,
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
