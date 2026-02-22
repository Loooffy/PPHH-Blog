'use client';

import { useTheme } from '@/contexts/ThemeContext';

interface ThemeToggleProps {
  disabled?: boolean;
}

export function ThemeToggle({ disabled = false }: ThemeToggleProps) {
  const { mode, toggleMode } = useTheme();

  return (
    <button
      type="button"
      onClick={disabled ? undefined : toggleMode}
      disabled={disabled}
      className={`w-10 h-10 rounded-full bg-surface text-text flex items-center justify-center transition-all duration-300 shadow-[0_2px_8px_rgba(0,0,0,0.1)] md:w-9 md:h-9 ${
        disabled
          ? 'cursor-not-allowed opacity-50 pointer-events-none'
          : 'cursor-pointer hover:bg-primary hover:text-white hover:border-primary hover:scale-105'
      }`}
      aria-label={`切換到${mode === 'light' ? '深色' : '淺色'}模式`}
      title={disabled ? '僅在 dev 頁面可切換主題' : `目前為${mode === 'light' ? '淺色' : '深色'}模式`}
    >
      {mode === 'light' ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      )}
    </button>
  );
}
