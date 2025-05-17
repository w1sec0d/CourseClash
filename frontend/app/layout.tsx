import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import clsx from 'clsx';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Course Clash - Transforma tu Aprendizaje en una Aventura',
  description:
    'Gamifica tu experiencia académica con duelos, logros y personalización.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='es'>
      <body className={clsx(inter.className, 'bg-white')}>
        <NavigationBar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
