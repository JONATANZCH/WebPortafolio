'use client';

import { useState, useCallback } from 'react';
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

function validateField(field: keyof FormValues, value: string): string | undefined {
  switch (field) {
    case 'name':
      if (!value.trim()) return 'El nombre es requerido.';
      if (value.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
      break;
    case 'email':
      if (!value.trim()) return 'El correo es requerido.';
      if (!EMAIL_REGEX.test(value.trim())) return 'Ingresa un correo electrónico válido.';
      break;
    case 'subject':
      if (!value.trim()) return 'El asunto es requerido.';
      if (value.trim().length < 3) return 'El asunto debe tener al menos 3 caracteres.';
      break;
    case 'message':
      if (!value.trim()) return 'El mensaje es requerido.';
      if (value.trim().length < 10) return 'El mensaje debe tener al menos 10 caracteres.';
      break;
  }
  return undefined;
}

function validateAll(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  (Object.keys(values) as (keyof FormValues)[]).forEach((field) => {
    const err = validateField(field, values[field]);
    if (err) errors[field] = err;
  });
  return errors;
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

export default function ContactForm() {
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error('Server responded with an error.');

      showToast('success', '¡Mensaje enviado! Me pondré en contacto pronto.');
      setValues(INITIAL_VALUES);
      setErrors({});
      setTouched({});
    } catch {
      showToast('error', 'Algo salió mal. Por favor intenta de nuevo.');
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
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tu nombre"
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
            Correo electrónico
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="tu@correo.com"
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
            Asunto
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            value={values.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="¿De qué trata tu mensaje?"
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
            Mensaje
          </label>
          <textarea
            id="message"
            name="message"
            value={values.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Cuéntame sobre tu proyecto o idea..."
            rows={6}
            className={`${styles.textarea} ${touched.message && errors.message ? styles.inputError : ''}`}
            disabled={isSubmitting}
          />
          {touched.message && errors.message && (
            <p className={styles.errorMsg} role="alert">{errors.message}</p>
          )}
        </div>

        <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
          {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>

      <Toast toast={toast} />
    </>
  );
}
