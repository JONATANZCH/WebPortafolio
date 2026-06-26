import { Injectable } from '@nestjs/common';
import {
  VALIDATION_MESSAGES,
  ERROR_MESSAGES,
  EMAIL_MESSAGES,
  Language,
} from './i18n.constants.js';

@Injectable()
export class I18nService {
  /**
   * Get a validation message by key and language.
   * Falls back to English if language is not supported.
   */
  getValidationMessage(key: string, language: Language = 'es'): string {
    const messages = VALIDATION_MESSAGES[language] || VALIDATION_MESSAGES.en;
    return messages[key] || `Validation error: ${key}`;
  }

  /**
   * Get an error message by key and language.
   * Falls back to English if language is not supported.
   */
  getErrorMessage(key: string, language: Language = 'es'): string {
    const messages = ERROR_MESSAGES[language] || ERROR_MESSAGES.en;
    return messages[key] || `Error: ${key}`;
  }

  /**
   * Get an email message by key and language.
   * Falls back to English if language is not supported.
   */
  getEmailMessage(key: string, language: Language = 'es'): string {
    const messages = EMAIL_MESSAGES[language] || EMAIL_MESSAGES.en;
    return messages[key] || key;
  }

  /**
   * Get all messages for a type and language.
   */
  getValidationMessages(language: Language = 'es'): Record<string, string> {
    return VALIDATION_MESSAGES[language] || VALIDATION_MESSAGES.en;
  }

  getErrorMessages(language: Language = 'es'): Record<string, string> {
    return ERROR_MESSAGES[language] || ERROR_MESSAGES.en;
  }

  getEmailMessages(language: Language = 'es'): Record<string, string> {
    return EMAIL_MESSAGES[language] || EMAIL_MESSAGES.en;
  }

  /**
   * Check if a language is supported.
   */
  isSupportedLanguage(language: string): language is Language {
    return language === 'es' || language === 'en';
  }

  /**
   * Get the default language.
   */
  getDefaultLanguage(): Language {
    return 'es';
  }
}
