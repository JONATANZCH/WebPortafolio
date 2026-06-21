import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres.' })
  @MaxLength(120, { message: 'El nombre no puede superar los 120 caracteres.' })
  name: string;

  @IsEmail({}, { message: 'El email no es válido.' })
  @IsNotEmpty({ message: 'El email es requerido.' })
  @MaxLength(254, { message: 'El email no puede superar los 254 caracteres.' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El asunto es requerido.' })
  @MinLength(3, { message: 'El asunto debe tener al menos 3 caracteres.' })
  @MaxLength(200, { message: 'El asunto no puede superar los 200 caracteres.' })
  subject: string;

  @IsString()
  @IsNotEmpty({ message: 'El mensaje es requerido.' })
  @MinLength(10, { message: 'El mensaje debe tener al menos 10 caracteres.' })
  message: string;
}

export class ContactResponseDto {
  success: boolean;
  messageId: string;
}
