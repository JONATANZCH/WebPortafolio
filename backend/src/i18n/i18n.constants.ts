export type Language = 'es' | 'en';

export const VALIDATION_MESSAGES: Record<Language, Record<string, string>> = {
  es: {
    NAME_REQUIRED: 'El nombre es requerido.',
    NAME_MIN_LENGTH: 'El nombre debe tener al menos 2 caracteres.',
    NAME_MAX_LENGTH: 'El nombre no puede superar los 120 caracteres.',
    EMAIL_REQUIRED: 'El email es requerido.',
    EMAIL_INVALID: 'El email no es válido.',
    EMAIL_MAX_LENGTH: 'El email no puede superar los 254 caracteres.',
    SUBJECT_REQUIRED: 'El asunto es requerido.',
    SUBJECT_MIN_LENGTH: 'El asunto debe tener al menos 3 caracteres.',
    SUBJECT_MAX_LENGTH: 'El asunto no puede superar los 200 caracteres.',
    MESSAGE_REQUIRED: 'El mensaje es requerido.',
    MESSAGE_MIN_LENGTH: 'El mensaje debe tener al menos 10 caracteres.',
    MESSAGE_MAX_LENGTH: 'El mensaje no puede superar los 5000 caracteres.',
  },
  en: {
    NAME_REQUIRED: 'Name is required.',
    NAME_MIN_LENGTH: 'Name must be at least 2 characters long.',
    NAME_MAX_LENGTH: 'Name cannot exceed 120 characters.',
    EMAIL_REQUIRED: 'Email is required.',
    EMAIL_INVALID: 'Email is not valid.',
    EMAIL_MAX_LENGTH: 'Email cannot exceed 254 characters.',
    SUBJECT_REQUIRED: 'Subject is required.',
    SUBJECT_MIN_LENGTH: 'Subject must be at least 3 characters long.',
    SUBJECT_MAX_LENGTH: 'Subject cannot exceed 200 characters.',
    MESSAGE_REQUIRED: 'Message is required.',
    MESSAGE_MIN_LENGTH: 'Message must be at least 10 characters long.',
    MESSAGE_MAX_LENGTH: 'Message cannot exceed 5000 characters.',
  },
};

export const ERROR_MESSAGES: Record<Language, Record<string, string>> = {
  es: {
    SAVE_FAILED: 'No se pudo guardar el mensaje. Inténtalo de nuevo.',
    INVALID_LANGUAGE: 'Idioma no soportado.',
    INTERNAL_ERROR: 'Ha ocurrido un error interno. Por favor, inténtalo más tarde.',
  },
  en: {
    SAVE_FAILED: 'Failed to save message. Please try again.',
    INVALID_LANGUAGE: 'Unsupported language.',
    INTERNAL_ERROR: 'An internal error has occurred. Please try again later.',
  },
};

export const EMAIL_MESSAGES: Record<Language, Record<string, string>> = {
  es: {
    SUBJECT_PREFIX: '[Portfolio] Nuevo mensaje:',
    HEADER_TITLE: 'Nuevo mensaje de contacto',
    HEADER_SUBTITLE: 'Portfolio — jonatanzarate.dev',
    LABEL_NAME: 'Nombre',
    LABEL_EMAIL: 'Email',
    LABEL_SUBJECT: 'Asunto',
    LABEL_DATE: 'Fecha',
    LABEL_MESSAGE: 'Mensaje',
    FOOTER_ID: 'ID:',
  },
  en: {
    SUBJECT_PREFIX: '[Portfolio] New message:',
    HEADER_TITLE: 'New contact message',
    HEADER_SUBTITLE: 'Portfolio — jonatanzarate.dev',
    LABEL_NAME: 'Name',
    LABEL_EMAIL: 'Email',
    LABEL_SUBJECT: 'Subject',
    LABEL_DATE: 'Date',
    LABEL_MESSAGE: 'Message',
    FOOTER_ID: 'ID:',
  },
};
