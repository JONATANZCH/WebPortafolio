import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ContactMessage } from './contact.entity';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContactMessage]),
    ConfigModule,
  ],
  providers: [ContactService],
  controllers: [ContactController],
})
export class ContactModule {}
