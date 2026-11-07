'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import styles from './CommandPalette.module.css';

interface Command {
  id: string;
  group: 'sections' | 'pages' | 'actions';
  label: string;
  run: () => void;
}

export default function CommandPalette() {
  const t = useTranslations('common');
  const tp = useTranslations('common.palette');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setIndex(0);
    triggerRef.current?.focus();
  }, []);

  const go = useCallback(
    (hash: string) => {
      const home = `/${locale}`;
      if (pathname === home) {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push(`${home}#${hash}`);
      }
    },
    [locale, pathname, router],
  );

  const commands: Command[] = useMemo(() => {
    const other = locale === 'es' ? 'en' : 'es';
    const rest = pathname.replace(/^\/(es|en)/, '') || '';
    return [
      { id: 'cap', group: 'sections', label: t('capabilities'), run: () => go('capacidades') },
      { id: 'proj', group: 'sections', label: t('projects'), run: () => go('proyectos') },
      { id: 'contact', group: 'sections', label: t('contact'), run: () => go('contacto') },
      { id: 'about', group: 'pages', label: t('about_me'), run: () => router.push(`/${locale}/about`) },
      { id: 'blog', group: 'pages', label: t('blog'), run: () => router.push(`/${locale}/blog`) },
      { id: 'home', group: 'pages', label: t('home_top'), run: () => router.push(`/${locale}`) },
      { id: 'lang', group: 'actions', label: tp('language'), run: () => router.push(`/${other}${rest}`) },
    ];
  }, [go, locale, pathname, router, t, tp]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? commands.filter((c) => c.label.toLowerCase().includes(q)) : commands;
  }, [commands, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const choose = (c?: Command) => {
    if (!c) return;
    setOpen(false);
    setQuery('');
    setIndex(0);
    c.run();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(filtered[index]);
    }
  };

  const groups: Array<Command['group']> = ['sections', 'pages', 'actions'];

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen(true)}
        aria-label={tp('open')}
        aria-haspopup="dialog"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M20 20l-3.5-3.5" />
        </svg>
        <kbd className={styles.kbd}>Ctrl K</kbd>
      </button>

      {open && (
        <div className={styles.overlay} onMouseDown={close}>
          <div
            className={styles.dialog}
            role="dialog"
            aria-modal="true"
            aria-label={tp('open')}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={onKeyDown}
          >
            <input
              ref={inputRef}
              className={styles.input}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIndex(0);
              }}
              placeholder={tp('placeholder')}
              aria-label={tp('placeholder')}
            />
            <div className={styles.list} role="listbox">
              {filtered.length === 0 && <p className={styles.empty}>{tp('empty')}</p>}
              {groups.map((g) => {
                const items = filtered.filter((c) => c.group === g);
                if (items.length === 0) return null;
                return (
                  <div key={g}>
                    <p className={styles.group}>{tp(g)}</p>
                    {items.map((c) => {
                      const i = filtered.indexOf(c);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          role="option"
                          aria-selected={i === index}
                          className={`${styles.item} ${i === index ? styles.itemOn : ''}`}
                          onMouseEnter={() => setIndex(i)}
                          onClick={() => choose(c)}
                        >
                          {c.label}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <p className={styles.hint}>{tp('hint')}</p>
          </div>
        </div>
      )}
    </>
  );
}
