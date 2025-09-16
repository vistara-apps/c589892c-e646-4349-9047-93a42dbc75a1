'use client';

import { useState, useEffect } from 'react';
import { formatTokenAmount } from '../lib/utils';

export function UserTokenBalance() {
  const [balance, setBalance] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();

        if (data.success) {
          setBalance(data.data.tokenBalance);
        }
      } catch (error) {
        console.error('Error fetching balance:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    // Poll for balance updates every 30 seconds
    const interval = setInterval(fetchBalance, 30000);

    return () => clearInterval(interval);
  }, []);

  // Trigger animation when balance changes
  useEffect(() => {
    if (balance > 0 && !isLoading) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 500);
      return () => clearTimeout(timer);
    }
  }, [balance, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-1 bg-surface px-3 py-2 rounded-full">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
          <span className="font-semibold text-sm text-text-secondary">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <div className="flex items-center space-x-1 bg-accent bg-opacity-20 px-3 py-2 rounded-full">
        <div className="w-2 h-2 bg-accent rounded-full"></div>
        <span
          className={`font-semibold text-sm transition-all duration-300 ${
            isAnimating ? 'scale-110 text-accent' : 'text-text-primary'
          }`}
        >
          {formatTokenAmount(balance)}
        </span>
      </div>
    </div>
  );
}
