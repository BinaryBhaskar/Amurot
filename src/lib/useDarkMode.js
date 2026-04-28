import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'amurot-theme';

function getSystemPrefersDark() {
  return !!window.matchMedia?.('(prefers-color-scheme: dark)')?.matches;
}

function readSavedPreference() {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === 'dark' || raw === 'light') return raw;
  return null;
}

function applyThemeClass(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
}

export function useDarkMode() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'light';
    const saved = readSavedPreference();
    if (saved) return saved;
    return getSystemPrefersDark() ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const saved = readSavedPreference();
    if (saved) return;

    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media?.addEventListener) return;

    const onChange = (e) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    applyThemeClass(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const api = useMemo(() => {
    return {
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
    };
  }, [theme]);

  return api;
}
