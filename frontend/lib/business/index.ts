import es from './es';
import en from './en';
import type { BusinessContent } from './types';

export function getBusinessContent(locale: string): BusinessContent {
  return locale === 'en' ? en : es;
}
