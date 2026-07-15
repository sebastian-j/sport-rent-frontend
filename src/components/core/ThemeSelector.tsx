import { createContext, useContext, useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

type ThemeMode = 'light' | 'system' | 'dark';

type ThemeContextValue = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
};

const THEME_STORAGE_KEY = 'theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

const themeOptions = [
  { value: 'light', label: 'Jasny motyw', Icon: Sun },
  { value: 'system', label: 'Motyw systemowy', Icon: Monitor },
  { value: 'dark', label: 'Ciemny motyw', Icon: Moon },
] satisfies { value: ThemeMode; label: string; Icon: typeof Sun }[];

function getInitialTheme(): ThemeMode {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  return storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
    ? storedTheme
    : 'system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && systemTheme.matches);
      document.documentElement.classList.toggle('dark', isDark);
    };

    applyTheme();
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    systemTheme.addEventListener('change', applyTheme);

    return () => systemTheme.removeEventListener('change', applyTheme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export default function ThemeSelector() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('ThemeSelector must be used within ThemeProvider');
  }

  return (
    <div
      role="radiogroup"
      aria-label="Motyw kolorystyczny"
      className="grid grid-cols-3 gap-1 border-t border-app-borderSoft pt-2"
    >
      {themeOptions.map(({ value, label, Icon }) => {
        const isSelected = context.theme === value;

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={label}
            title={label}
            onClick={() => context.setTheme(value)}
            className={`flex h-9 w-9 items-center justify-center rounded-md transition-colors ${
              isSelected
                ? 'bg-app-surfaceStrong text-app-textInverted'
                : 'text-app-textMuted hover:bg-app-surfaceSoft hover:text-app-text'
            }`}
          >
            <Icon size={18} aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
