import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavigationBar from '../components/NavigationBar';
import Sidebar from '../components/Sidebar';
import SidebarOverlay from '@/components/SidebarOverlay';
import Footer from '../components/Footer';
import clsx from 'clsx';
import { AuthProvider } from '@/lib/auth-context';

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
        <AuthProvider>
          <NavigationBar />
          <div className='flex pl-64 min-h-screen'>
            <aside className="hidden lg:block w-64 fixed top-16 left-0 h-[calc(100vh-4rem)] z-40">
              <Sidebar />
            </aside>
            <SidebarOverlay />
            <main>{children}
            <Footer />
            </main>
          </div>  
        </AuthProvider>
      </body>
    </html>
  );
}
