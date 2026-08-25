import type { Metadata } from 'next';
import './globals.css';
import { AssessmentProvider } from '@/context/AssessmentContext';

export const metadata: Metadata = {
  title: 'VedaAI - AI Assessment Extraction & Answer Mapping',
  description: 'Extract question papers, map student handwritten answers side-by-side, highlight answer sheet regions, and generate AI evaluation insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AssessmentProvider>
          <div className="app-container">
            {children}
          </div>
        </AssessmentProvider>
      </body>
    </html>
  );
}
