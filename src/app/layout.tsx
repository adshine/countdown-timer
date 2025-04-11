import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Countdown Timer",
  description: "A futuristic countdown timer application",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetBrainsMono.variable}`}>
      <body className="bg-background text-white antialiased min-h-screen flex flex-col">
        <main className="flex-grow flex flex-col">{children}</main>
        <footer className="py-4 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Countdown Timer App</p>
        </footer>
      </body>
    </html>
  );
}
