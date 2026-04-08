import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import ThemeProvider from "@/components/common/ThemeProvider";

export const metadata: Metadata = {
  title: "CivicAI",
  description: "AI-powered municipal by-law assistant",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider>
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}