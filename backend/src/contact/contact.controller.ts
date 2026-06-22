import { Body, Controller, Post, HttpCode, Ip } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service.js';
import { ContactResponseDto, CreateContactDto } from './contact.dto.js';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  async createContact(
    @Body() dto: CreateContactDto,
    @Ip() ip: string,
  ): Promise<ContactResponseDto> {
    return this.contactService.createContact(dto, ip);
  }
}
