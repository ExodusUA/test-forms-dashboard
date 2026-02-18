import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { ToastContainer } from "@/components/ui/toast-container";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Forms Dashboard - Manage Your Forms",
  description: "Create, manage, and track your forms effortlessly with Forms Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="flex flex-col font-sans antialiased">
        <Header />
        <main style={{ minHeight: 'calc(100vh - 4rem)' }}>
          {children}
        </main>
        <ToastContainer />
      </body>
    </html>
  );
}