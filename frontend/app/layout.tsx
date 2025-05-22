import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavigationBar from '../components/NavigationBar';
// import Sidebar from '../components/Sidebar';
// import SidebarOverlay from '@/components/SidebarOverlay';
import Footer from '../components/Footer';
import clsx from 'clsx';
import { AuthProvider } from '@/lib/auth-context';
import { Suspense } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

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
      <body
        className={clsx(inter.className, 'bg-white min-h-screen flex flex-col')}
      >
        <AuthProvider>
          <NavigationBar />
          <Suspense fallback={<LoadingSpinner />}>
            <main className='flex-1 flex flex-col'>
              {children}
              <Footer />
            </main>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
