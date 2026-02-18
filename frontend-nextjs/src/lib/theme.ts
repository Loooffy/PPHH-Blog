// 主題類型定義
export type Category = 'dev' | 'game' | 'film' | 'book';
export type ThemeMode = 'light' | 'dark';

// 類別中文名稱對應
export const categoryNames: Record<Category, string> = {
  dev: '軟體開發',
  game: '遊戲開發',
  film: '影評',
  book: '書評',
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
}

// 完整主題定義
export interface Theme {
  colors: ThemeColors;
  fonts: {
    heading: string;
    body: string;
  };
  layout: 'grid' | 'masonry' | 'single' | 'card';
}

// 4個類別的主題配置
export const themes: Record<Category, { light: Theme; dark: Theme }> = {
  // 軟體開發 - 科技風格
  dev: {
    light: {
      colors: {
        primary: '#00bcd4', // 青色
        secondary: '#0097a7',
        background: '#f5f5f5',
        surface: '#ffffff',
        text: '#212121',
        textSecondary: '#757575',
        border: '#e0e0e0',
        accent: '#00acc1',
      },
      fonts: {
        heading: 'monospace',
        body: 'system-ui, sans-serif',
      },
      layout: 'grid',
    },
    dark: {
      colors: {
        primary: '#00bcd4', // 青色霓虹
        secondary: '#00acc1',
        background: '#121212',
        surface: '#1e1e1e',
        text: '#e0e0e0',
        textSecondary: '#b0b0b0',
        border: '#333333',
        accent: '#00e5ff',
      },
      fonts: {
        heading: 'monospace',
        body: 'system-ui, sans-serif',
      },
      layout: 'grid',
    },
  },
  // 遊戲開發 - 遊戲風格
  game: {
    light: {
      colors: {
        primary: '#ff6b35', // 橘紅色
        secondary: '#f7931e',
        background: '#fff8f0',
        surface: '#ffffff',
        text: '#2c2c2c',
        textSecondary: '#666666',
        border: '#ffd4c4',
        accent: '#ff8c42',
      },
      fonts: {
        heading: 'system-ui, sans-serif',
        body: 'system-ui, sans-serif',
      },
      layout: 'card',
    },
    dark: {
      colors: {
        primary: '#ff6b35', // 橘紅色發光
        secondary: '#ff8c42',
        background: '#1a0f0a',
        surface: '#2a1f1a',
        text: '#f5f5f5',
        textSecondary: '#d0d0d0',
        border: '#4a2f1f',
        accent: '#ff9f5e',
      },
      fonts: {
        heading: 'system-ui, sans-serif',
        body: 'system-ui, sans-serif',
      },
      layout: 'card',
    },
  },
  // 影評 - 電影風格
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
      },
      fonts: {
        heading: "'Inter', sans-serif",
        body: "'Inter', sans-serif",
      },
      layout: 'masonry',
    },
  },
  // 書評 - 文藝風格
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
      },
      fonts: {
        heading: 'Georgia, serif',
        body: 'Georgia, serif',
      },
      layout: 'single',
    },
    dark: {
      colors: {
        primary: '#d7ccc8', // 淺棕色
        secondary: '#bcaaa4',
        background: '#1a1614',
        surface: '#2a2520',
        text: '#efebe9',
        textSecondary: '#d7ccc8',
        border: '#4a3f38',
        accent: '#a1887f',
      },
      fonts: {
        heading: 'Georgia, serif',
        body: 'Georgia, serif',
      },
      layout: 'single',
    },
  },
};

// 取得當前主題
export function getTheme(category: Category, mode: ThemeMode): Theme {
  return themes[category][mode];
}

// 產生 CSS 變數
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
    --font-heading: ${theme.fonts.heading};
    --font-body: ${theme.fonts.body};
  `;
}
