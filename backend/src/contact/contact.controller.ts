import { Body, Controller, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactResponseDto, CreateContactDto } from './contact.dto';

@Controller('api/contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async createContact(
    @Body() dto: CreateContactDto,
  ): Promise<ContactResponseDto> {
    return this.contactService.createContact(dto);
  }
}
