'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import styles from './DirectContact.module.css';

export default function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);
  const es = useLocale() !== 'en';

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available: the mailto link still works.
    }
  };

  return (
    <button type="button" className={styles.copy} onClick={copy} aria-live="polite">
      {copied ? (es ? 'Copiado ✓' : 'Copied ✓') : es ? 'Copiar correo' : 'Copy email'}
    </button>
  );
}
