import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import ConditionalLayout from '@/components/ConditionalLayout';

const inter = Inter({ subsets: ['latin', 'vietnamese'] });

export const metadata: Metadata = {
  title: 'BiMax Auto Motors - Xe hơi chất lượng',
  description: 'BiMax - Đem đến trải nghiệm xe hơi tốt nhất cho bạn. Chất lượng - Uy tín - Giá tốt.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
