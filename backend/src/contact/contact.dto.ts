import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export type Language = 'es' | 'en';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'Name is required.' })
  @MinLength(2, { message: 'Name must be at least 2 characters.' })
  @MaxLength(120, { message: 'Name cannot exceed 120 characters.' })
  name!: string;

  @IsEmail({}, { message: 'Email is invalid.' })
  @IsNotEmpty({ message: 'Email is required.' })
  @MaxLength(254, { message: 'Email cannot exceed 254 characters.' })
  email!: string;

  @IsString()
  @IsNotEmpty({ message: 'Subject is required.' })
  @MinLength(3, { message: 'Subject must be at least 3 characters.' })
  @MaxLength(200, { message: 'Subject cannot exceed 200 characters.' })
  subject!: string;

  @IsString()
  @IsNotEmpty({ message: 'Message is required.' })
  @MinLength(10, { message: 'Message must be at least 10 characters.' })
  @MaxLength(5000, { message: 'Message cannot exceed 5000 characters.' })
  message!: string;

  @IsOptional()
  @IsString()
  language?: Language;
}

export class ContactResponseDto {
  success!: boolean;
  messageId!: string;
}
