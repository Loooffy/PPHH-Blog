// 主題類型定義
export type Category = 'dev' | 'game' | 'film' | 'book';
export type ThemeMode = 'light' | 'dark';

// 類別中文名稱對應
export const categoryNames: Record<Category, string> = {
  dev: 'DEV',
  game: 'GAME',
  film: 'FILM',
  book: 'BOOK',
};

// 類別路由對應
export const categoryRoutes: Record<Category, string> = {
  dev: '/dev',
  game: '/game',
  film: '/film',
  book: '/book',
};

// 主題顏色定義
export interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  accent: string;
  /** Tag hover 背景色：dark theme 白底、light theme 黑底 */
  tagHoverBg: string;
  /** Tag hover 文字色：dark theme 黑字、light theme 白字 */
  tagHoverText: string;
}

export interface Theme {
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
  };
  layout: 'grid' | 'masonry' | 'single' | 'card';
}

export const themes: Record<Category, { light: Theme; dark: Theme }> = {
  dev: {
    light: {
      colors: {
        primary: '#00bcd4',
        secondary: '#0097a7',
        background: '#f5f5f5',
        surface: '#ffffff',
        text: '#212121',
        textSecondary: '#757575',
        border: '#e0e0e0',
        accent: '#00acc1',
        tagHoverBg: '#000000',
        tagHoverText: '#ffffff',
      },
      fonts: {
        heading: 'monospace',
        body: 'system-ui, sans-serif',
      },
      layout: 'grid',
    },
    dark: {
      colors: {
        primary: '#00bcd4',
        secondary: '#00acc1',
        background: '#121212',
        surface: '#1e1e1e',
        text: '#e0e0e0',
        textSecondary: '#b0b0b0',
        border: '#333333',
        accent: '#00e5ff',
        tagHoverBg: '#ffffff',
        tagHoverText: '#000000',
      },
      fonts: {
        heading: 'monospace',
        body: 'system-ui, sans-serif',
      },
      layout: 'grid',
    },
  },
  game: {
    light: {
      colors: {
        primary: '#ff6b35',
        secondary: '#f7931e',
        background: '#fff8f0',
        surface: '#ffffff',
        text: '#2c2c2c',
        textSecondary: '#666666',
        border: '#ffd4c4',
        accent: '#ff8c42',
        tagHoverBg: '#e8ac03',
        tagHoverText: '#000000',
      },
      fonts: {
        heading: 'system-ui, sans-serif',
        body: 'system-ui, sans-serif',
      },
      layout: 'card',
    },
    dark: {
      colors: {
        primary: '#ff6b35',
        secondary: '#ff8c42',
        background: '#1a0f0a',
        surface: '#2a1f1a',
        text: '#f5f5f5',
        textSecondary: '#d0d0d0',
        border: '#4a2f1f',
        accent: '#ff9f5e',
        tagHoverBg: '#e8ac03',
        tagHoverText: '#000000',
      },
      fonts: {
        heading: 'system-ui, sans-serif',
        body: 'system-ui, sans-serif',
      },
      layout: 'card',
    },
  },
  film: {
    light: {
      colors: {
        primary: '#222222',
        secondary: '#444444',
        background: '#fafafa',
        surface: '#ffffff',
        text: '#222222',
        textSecondary: '#333333',
        border: '#e1bee7',
        accent: '#fafafa',
        tagHoverBg: '#000000',
        tagHoverText: '#ffffff',
      },
      fonts: {
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
      },
      layout: 'masonry',
    },
    dark: {
      colors: {
        primary: '#dfdfdf', 
        secondary: '#e2d7a7', 
        background: '#1c1c1c', 
        surface: '#2a2a2a',
        text: '#dfdfdf', 
        textSecondary: '#b0b0b0',
        border: '#dfdfdf', 
        accent: '#e2d7a7', 
        tagHoverBg: '#ffffff',
        tagHoverText: '#000000',
      },
      fonts: {
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
      },
      layout: 'masonry',
    },
  },
  book: {
    light: {
      colors: {
        primary: '#8d6e63',
        secondary: '#6d4c41',
        background: '#fafafa',
        surface: '#ffffff',
        text: '#3e2723',
        textSecondary: '#5d4037',
        border: '#d7ccc8',
        accent: '#fafafa',
        tagHoverBg: '#000000',
        tagHoverText: '#ffffff',
      },
      fonts: {
        heading: 'Georgia, serif',
        body: 'Georgia, serif',
      },
      layout: 'single',
    },
    dark: {
      colors: {
        primary: '#d7ccc8',
        secondary: '#bcaaa4',
        background: '#1a1614',
        surface: '#2a2520',
        text: '#efebe9',
        textSecondary: '#d7ccc8',
        border: '#4a3f38',
        accent: '#a1887f',
        tagHoverBg: '#ffffff',
        tagHoverText: '#000000',
      },
      fonts: {
        heading: 'Georgia, serif',
        body: 'Georgia, serif',
      },
      layout: 'single',
    },
  },
};

export function getTheme(category: Category, mode: ThemeMode): Theme {
  return themes[category][mode];
}

export function generateThemeCSS(theme: Theme): string {
  return `
    --color-primary: ${theme.colors.primary};
    --color-secondary: ${theme.colors.secondary};
    --color-background: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    --color-text: ${theme.colors.text};
    --color-text-secondary: ${theme.colors.textSecondary};
    --color-border: ${theme.colors.border};
    --color-accent: ${theme.colors.accent};
    --color-tag-hover-bg: ${theme.colors.tagHoverBg};
    --color-tag-hover-text: ${theme.colors.tagHoverText};
    --font-heading: ${theme.fonts.heading};
    --font-body: ${theme.fonts.body};
  `;
}
