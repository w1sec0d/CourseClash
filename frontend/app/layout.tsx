import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import NavigationBar from '../components/NavigationBar';
import clsx from 'clsx';
import { AuthProviderApollo } from '@/lib/auth-context-apollo';
import { ConditionalLayout } from '@/components/ConditionalLayout';
import { ApolloProviderWrapper } from '@/lib/apollo-provider';

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
        <ApolloProviderWrapper>
          <AuthProviderApollo>
            <NavigationBar />
            <ConditionalLayout>{children}</ConditionalLayout>
          </AuthProviderApollo>
        </ApolloProviderWrapper>
      </body>
    </html>
  );
}
