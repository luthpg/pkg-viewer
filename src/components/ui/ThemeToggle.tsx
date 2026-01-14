import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (t: Theme) => {
      if (t === 'system') {
        const systemDark = window.matchMedia(
          '(prefers-color-scheme: dark)',
        ).matches;
        root.classList.toggle('dark', systemDark);
      } else {
        root.classList.toggle('dark', t === 'dark');
      }
    };

    applyTheme(theme);
    localStorage.setItem('theme', theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'system';
      return 'light';
    });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 transition-all duration-200 text-gray-600 dark:text-gray-300"
      aria-label="Toggle theme"
      title={`Current: ${theme}`}
    >
      {theme === 'dark' ? (
        <Moon size={20} />
      ) : theme === 'light' ? (
        <Sun size={20} />
      ) : (
        <div className="relative w-5 h-5">
          <Sun size={14} className="absolute top-0 left-0" />
          <Moon size={14} className="absolute bottom-0 right-0" />
        </div>
      )}
    </button>
  );
};
