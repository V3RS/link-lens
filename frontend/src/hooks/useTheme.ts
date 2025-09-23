import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { THEME, STORAGE_KEYS } from '../constants';

export type Theme = 'dark' | 'light';

export function useTheme() {
  const [theme, setTheme] = useLocalStorage<Theme>(
    STORAGE_KEYS.THEME,
    THEME.DEFAULT
  );

  useEffect(() => {
    document.documentElement.classList.toggle(
      THEME.CLASS_NAME,
      theme === 'light'
    );
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return { theme, setTheme, toggleTheme };
}
