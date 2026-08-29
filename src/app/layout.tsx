import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "AI Evaluator — VedaAI",
  description:
    "Upload a question paper and a student's answer sheet to map, review, and grade answers side by side.",
  icons: {
    icon: "/veda-logo.png",
    shortcut: "/veda-logo.png",
    apple: "/veda-logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${figtree.variable} ${bricolage.variable} h-dvh antialiased`}>
      <body className="h-dvh flex flex-col overflow-hidden">{children}</body>
    </html>
  );
}
