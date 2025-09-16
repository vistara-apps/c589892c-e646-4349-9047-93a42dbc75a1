import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'PollPulse - Tap into community polls and get rewarded',
  description: 'A Base Mini App that curates community-driven polls for events or trends, rewarding participation.',
  keywords: ['polls', 'community', 'rewards', 'base', 'miniapp'],
  openGraph: {
    title: 'PollPulse',
    description: 'Tap into community polls and get rewarded',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bg text-text-primary">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
