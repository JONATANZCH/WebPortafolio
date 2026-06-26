import { Body, Controller, Post, HttpCode, Ip, Headers } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ContactService } from './contact.service.js';
import { ContactResponseDto, CreateContactDto, Language } from './contact.dto.js';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(200)
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  async createContact(
    @Body() dto: CreateContactDto,
    @Ip() ip: string,
    @Headers('accept-language') acceptLanguage?: string,
  ): Promise<ContactResponseDto> {
    // Language priority: dto.language > accept-language header > default (es)
    const language = this.resolveLanguage(dto.language, acceptLanguage);
    return this.contactService.createContact(dto, ip, language);
  }

  /**
   * Resolves language from multiple sources in priority order.
   */
  private resolveLanguage(
    dtoLanguage?: string,
    acceptLanguage?: string,
  ): Language {
    // 1. Language explicitly provided in DTO
    if (dtoLanguage && (dtoLanguage === 'es' || dtoLanguage === 'en')) {
      return dtoLanguage;
    }

    // 2. Accept-Language header
    if (acceptLanguage) {
      const primary = acceptLanguage.split(',')[0].split('-')[0].toLowerCase();
      if (primary === 'en') return 'en';
      if (primary === 'es') return 'es';
    }

    // 3. Default to Spanish
    return 'es';
  }
}
