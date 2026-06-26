'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { type Language } from '@/lib/sanity.queries';
import styles from './ContactForm.module.css';

/* ------------------------------------------------------------------ */
/* Types                                                                 */
/* ------------------------------------------------------------------ */

interface FormValues {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface ToastState {
  visible: boolean;
  type: 'success' | 'error';
  message: string;
}

/* ------------------------------------------------------------------ */
/* Validation helpers                                                    */
/* ------------------------------------------------------------------ */

// RFC 5322 simplified (good enough for most cases)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function createValidator(t: any) {
  return function validateField(field: keyof FormValues, value: string): string | undefined {
    switch (field) {
      case 'name':
        if (!value.trim()) return t('contact.validation.name_required');
        if (value.trim().length < 2) return t('contact.validation.name_min');
        break;
      case 'email':
        if (!value.trim()) return t('contact.validation.email_required');
        if (!EMAIL_REGEX.test(value.trim())) return t('contact.validation.email_invalid');
        break;
      case 'subject':
        if (!value.trim()) return t('contact.validation.subject_required');
        if (value.trim().length < 3) return t('contact.validation.subject_min');
        break;
      case 'message':
        if (!value.trim()) return t('contact.validation.message_required');
        if (value.trim().length < 10) return t('contact.validation.message_min');
        break;
    }
    return undefined;
  };
}

function createValidateAll(validateField: (field: keyof FormValues, value: string) => string | undefined) {
  return function validateAll(values: FormValues): FormErrors {
    const errors: FormErrors = {};
    (Object.keys(values) as (keyof FormValues)[]).forEach((field) => {
      const err = validateField(field, values[field]);
      if (err) errors[field] = err;
    });
    return errors;
  };
}

/* ------------------------------------------------------------------ */
/* Toast sub-component                                                   */
/* ------------------------------------------------------------------ */

function Toast({ toast }: { toast: ToastState }) {
  if (!toast.visible) return null;
  return (
    <div
      className={`${styles.toast} ${toast.type === 'success' ? styles.toastSuccess : styles.toastError}`}
      role="alert"
      aria-live="polite"
    >
      <span className={styles.toastIcon}>{toast.type === 'success' ? '✓' : '✕'}</span>
      <span>{toast.message}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* ContactForm                                                           */
/* ------------------------------------------------------------------ */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

const INITIAL_VALUES: FormValues = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

interface ContactFormProps {
  locale: Language;
}

export default function ContactForm({ locale }: ContactFormProps) {
  const t = useTranslations();
  const validateField = createValidator(t);
  const validateAll = createValidateAll(validateField);

  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>({ visible: false, type: 'success', message: '' });

  /* Show a toast and auto-dismiss after 4 s */
  const showToast = useCallback((type: 'success' | 'error', message: string) => {
    setToast({ visible: true, type, message });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 4000);
  }, []);

  /* Handle input changes */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    /* Re-validate live if the field was already touched */
    if (touched[name as keyof FormValues]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name as keyof FormValues, value) }));
    }
  };

  /* Validate on blur */
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name as keyof FormValues, value) }));
  };

  /* Submit */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    /* Mark all fields as touched and validate */
    const allTouched: Partial<Record<keyof FormValues, boolean>> = {
      name: true, email: true, subject: true, message: true,
    };
    setTouched(allTouched);

    const newErrors = validateAll(values);
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': locale,
        },
        body: JSON.stringify({ ...values, language: locale }),
      });

      if (!res.ok) throw new Error('Server responded with an error.');

      showToast('success', t('contact.form.success'));
      setValues(INITIAL_VALUES);
      setErrors({});
      setTouched({});
    } catch {
      showToast('error', t('contact.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Name */}
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            {t('contact.form.name')}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={locale === 'es' ? 'Tu nombre' : 'Your name'}
            className={`${styles.input} ${touched.name && errors.name ? styles.inputError : ''}`}
            autoComplete="name"
            disabled={isSubmitting}
          />
          {touched.name && errors.name && (
            <p className={styles.errorMsg} role="alert">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>
            {t('contact.form.email')}
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={locale === 'es' ? 'tu@correo.com' : 'your@email.com'}
            className={`${styles.input} ${touched.email && errors.email ? styles.inputError : ''}`}
            autoComplete="email"
            disabled={isSubmitting}
          />
          {touched.email && errors.email && (
            <p className={styles.errorMsg} role="alert">{errors.email}</p>
          )}
        </div>

        {/* Subject */}
        <div className={styles.field}>
          <label htmlFor="subject" className={styles.label}>
            {t('contact.form.subject')}
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={locale === 'es' ? '¿De qué trata tu mensaje?' : 'What is your message about?'}
            className={`${styles.input} ${touched.subject && errors.subject ? styles.inputError : ''}`}
            disabled={isSubmitting}
          />
          {touched.subject && errors.subject && (
            <p className={styles.errorMsg} role="alert">{errors.subject}</p>
          )}
        </div>

        {/* Message */}
        <div className={styles.field}>
          <label htmlFor="message" className={styles.label}>
            {t('contact.form.message')}
          </label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={locale === 'es' ? 'Cuéntame sobre tu proyecto o idea...' : 'Tell me about your project or idea...'}
            rows={6}
            className={`${styles.textarea} ${touched.message && errors.message ? styles.inputError : ''}`}
            disabled={isSubmitting}
          />
          {touched.message && errors.message && (
            <p className={styles.errorMsg} role="alert">{errors.message}</p>
          )}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? t('contact.form.sending') : t('contact.form.submit')}
        </button>
      </form>

      <Toast toast={toast} />
    </>
  );
}
