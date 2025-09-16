'use client';

import dynamic from 'next/dynamic';

// Dynamically import OnchainKitProvider to avoid SSR issues
const OnchainKitProvider = dynamic(
  () => import('@coinbase/onchainkit').then(mod => mod.OnchainKitProvider),
  { ssr: false }
);

const baseChain = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://mainnet.base.org'],
    },
    public: {
      http: ['https://mainnet.base.org'],
    },
  },
  blockExplorers: {
    default: { name: 'Basescan', url: 'https://basescan.org' },
  },
  testnet: false,
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || ''}
      chain={baseChain}
    >
      {children}
    </OnchainKitProvider>
  );
}
