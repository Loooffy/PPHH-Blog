import { TopNavbar } from "@/components/TopNavbar";
import { ThemeProvider } from "@/contexts/ThemeContext";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Potta_One } from "next/font/google";
import "./tailwind.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const pottaOne = Potta_One({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "PpHh Blog",
  description: "個人部落格 - 軟體開發、遊戲開發、影評、書評",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className="bg-background">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pottaOne.variable} antialiased bg-background text-text font-body transition-colors duration-300`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedCategory = localStorage.getItem('blog-category') || 'dev';
                  const savedMode = localStorage.getItem('blog-theme-mode');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  const mode = savedMode && ['light', 'dark'].includes(savedMode) ? savedMode : (prefersDark ? 'dark' : 'light');
                  
                  const themes = {
                    dev: {
                      light: { background: '#f5f5f5', surface: '#ffffff', text: '#212121', textSecondary: '#757575', border: '#e0e0e0', primary: '#00bcd4', secondary: '#0097a7', accent: '#00acc1', fontHeading: 'monospace', fontBody: 'system-ui, sans-serif' },
                      dark: { background: '#121212', surface: '#1e1e1e', text: '#e0e0e0', textSecondary: '#b0b0b0', border: '#333333', primary: '#00bcd4', secondary: '#00acc1', accent: '#00e5ff', fontHeading: 'monospace', fontBody: 'system-ui, sans-serif' }
                    },
                    game: {
                      light: { background: '#fff8f0', surface: '#ffffff', text: '#2c2c2c', textSecondary: '#666666', border: '#ffd4c4', primary: '#ff6b35', secondary: '#f7931e', accent: '#ff8c42', fontHeading: 'system-ui, sans-serif', fontBody: 'system-ui, sans-serif' },
                      dark: { background: '#1a0f0a', surface: '#2a1f1a', text: '#f5f5f5', textSecondary: '#d0d0d0', border: '#4a2f1f', primary: '#ff6b35', secondary: '#ff8c42', accent: '#ff9f5e', fontHeading: 'system-ui, sans-serif', fontBody: 'system-ui, sans-serif' }
                    },
                    film: {
                      light: { background: '#f9f9f9', surface: '#ffffff', text: '#222222', textSecondary: '#333333', border: '#e1bee7', primary: '#222222', secondary: '#444444', accent: '#334033', fontHeading: "'Inter', sans-serif", fontBody: "'Inter', sans-serif" },
                      dark: { background: '#1c1c1c', surface: '#2a2a2a', text: '#dfdfdf', textSecondary: '#b0b0b0', border: '#dfdfdf', primary: '#dfdfdf', secondary: '#e2d7a7', accent: '#e2d7a7', fontHeading: "'Inter', sans-serif", fontBody: "'Inter', sans-serif" }
                    },
                    book: {
                      light: { background: '#fafafa', surface: '#ffffff', text: '#3e2723', textSecondary: '#5d4037', border: '#d7ccc8', primary: '#8d6e63', secondary: '#6d4c41', accent: '#fffaf0', fontHeading: 'Georgia, serif', fontBody: 'Georgia, serif' },
                      dark: { background: '#1a1614', surface: '#2a2520', text: '#efebe9', textSecondary: '#d7ccc8', border: '#4a3f38', primary: '#d7ccc8', secondary: '#bcaaa4', accent: '#a1887f', fontHeading: 'Georgia, serif', fontBody: 'Georgia, serif' }
                    }
                  };
                  
                  const category = ['dev', 'game', 'film', 'book'].includes(savedCategory) ? savedCategory : 'dev';
                  const theme = themes[category][mode];
                  const root = document.documentElement;
                  
                  root.style.setProperty('--color-background', theme.background);
                  root.style.setProperty('--color-surface', theme.surface);
                  root.style.setProperty('--color-text', theme.text);
                  root.style.setProperty('--color-text-secondary', theme.textSecondary);
                  root.style.setProperty('--color-border', theme.border);
                  root.style.setProperty('--color-primary', theme.primary);
                  root.style.setProperty('--color-secondary', theme.secondary);
                  root.style.setProperty('--color-accent', theme.accent);
                  root.style.setProperty('--font-heading', theme.fontHeading);
                  root.style.setProperty('--font-body', theme.fontBody);
                } catch (e) {}
              })();
            `,
          }}
        />
        <ThemeProvider>
          <TopNavbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
