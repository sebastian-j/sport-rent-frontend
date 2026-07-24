import { createContext, useContext, useEffect, useState } from 'react';

import Switch from './Switch.tsx';

type ThemeMode = 'light' | 'system' | 'dark';
type ManualTheme = Exclude<ThemeMode, 'system'>;

type ThemeContextValue = {
  theme: ThemeMode;
  manualTheme: ManualTheme;
  setTheme: (theme: ThemeMode) => void;
};

const THEME_STORAGE_KEY = 'theme';
const MANUAL_THEME_STORAGE_KEY = 'manual-theme';
const ThemeContext = createContext<ThemeContextValue | null>(null);

const themeOptions = [
  { value: 'light', label: 'Jasny' },
  { value: 'dark', label: 'Ciemny' },
] satisfies { value: ManualTheme; label: string }[];

function getInitialTheme(): ThemeMode {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  return storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system'
    ? storedTheme
    : 'system';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [manualTheme, setManualTheme] = useState<ManualTheme>(() => {
    const storedManualTheme = localStorage.getItem(MANUAL_THEME_STORAGE_KEY);

    if (storedManualTheme === 'light' || storedManualTheme === 'dark') {
      return storedManualTheme;
    }

    const initialTheme = getInitialTheme();

    if (initialTheme !== 'system') return initialTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const selectTheme = (nextTheme: ThemeMode) => {
    if (nextTheme !== 'system') setManualTheme(nextTheme);
    setTheme(nextTheme);
  };

  useEffect(() => {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = () => {
      const isDark = theme === 'dark' || (theme === 'system' && systemTheme.matches);
      document.documentElement.classList.toggle('dark', isDark);
    };

    applyTheme();
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    localStorage.setItem(MANUAL_THEME_STORAGE_KEY, manualTheme);
    systemTheme.addEventListener('change', applyTheme);

    return () => systemTheme.removeEventListener('change', applyTheme);
  }, [manualTheme, theme]);

  return (
    <ThemeContext.Provider value={{ theme, manualTheme, setTheme: selectTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function ThemeSelector() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('ThemeSelector must be used within ThemeProvider');
  }

  const isAuto = context.theme === 'system';

  return (
    <div className="border-t border-app-borderSoft pt-2">
      <div
        role="radiogroup"
        aria-label="Motyw kolorystyczny"
        className={`grid grid-cols-2 rounded-lg bg-app-surfaceSoft p-1 ${isAuto ? 'opacity-50' : ''}`}
      >
        {themeOptions.map(({ value, label }) => {
          const isSelected = context.manualTheme === value;

          return (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isAuto}
              onClick={() => context.setTheme(value)}
              className={`min-w-20 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                isSelected
                  ? 'bg-app-surfaceStrong text-app-textInverted shadow-sm'
                  : 'text-app-textMuted hover:text-app-text'
              } disabled:cursor-not-allowed`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <label className="mt-2 flex cursor-pointer items-center justify-between gap-4 rounded-lg px-2 py-2 hover:bg-app-surfaceSoft">
        <span className="text-sm font-medium">Tryb auto</span>
        <Switch
          ariaLabel="Tryb automatyczny motywu"
          checked={isAuto}
          onCheckedChange={(checked) => context.setTheme(checked ? 'system' : context.manualTheme)}
        />
      </label>
    </div>
  );
}
