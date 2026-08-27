import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AI Evaluator — VedaAI",
  description:
    "Upload a question paper and a student's answer sheet to map, review, and grade answers side by side.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-dvh antialiased`}>
      <body className="h-dvh flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}
