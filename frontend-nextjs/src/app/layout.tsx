import { TopNavbar } from "@/components/layout/TopNavbar";
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
    <html lang="zh-TW" className="bg-background" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pottaOne.variable} antialiased bg-background text-text font-body transition-colors duration-300`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <TopNavbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
