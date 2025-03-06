import React from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Header from "../components/server/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "Fantasy Football Draft Assistant",
  description: "A modern fantasy football draft management application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-slate-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        
        <footer className="py-6 px-4 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400 mt-auto">
          <p>© {new Date().getFullYear()} Fantasy Football Draft Assistant</p>
        </footer>
      </body>
    </html>
  );
}
