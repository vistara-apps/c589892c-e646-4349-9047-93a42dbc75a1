'use client';

import { useState, useEffect } from 'react';
import { formatTokenAmount } from '../lib/utils';

export function UserTokenBalance() {
  const [balance, setBalance] = useState(1250);
  const [isAnimating, setIsAnimating] = useState(false);

  // Simulate token balance updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update balance to simulate rewards
      if (Math.random() > 0.8) {
        setIsAnimating(true);
        setBalance(prev => prev + Math.floor(Math.random() * 20) + 5);
        setTimeout(() => setIsAnimating(false), 500);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

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
