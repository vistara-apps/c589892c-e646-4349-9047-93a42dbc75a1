'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@coinbase/minikit';
import { PollFeed } from '../components/PollFeed';
import { CreatePollForm } from '../components/CreatePollForm';
import { UserTokenBalance } from '../components/UserTokenBalance';
import { LoadingSpinner } from '../components/LoadingSpinner';

export default function HomePage() {
  const { context } = useMiniKit();
  const [activeTab, setActiveTab] = useState<'feed' | 'create'>('feed');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for initial data fetch
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-gray-700">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-text-primary">PollPulse</h1>
              <p className="text-sm text-text-secondary">
                {context?.user?.displayName ? `Welcome, ${context.user.displayName}` : 'Tap into community polls'}
              </p>
            </div>
            <UserTokenBalance />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-surface border-b border-gray-700">
        <div className="px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('feed')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'feed'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Poll Feed
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'create'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              Create Poll
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 py-6">
        {activeTab === 'feed' ? (
          <PollFeed />
        ) : (
          <CreatePollForm onPollCreated={() => {
            setActiveTab('feed');
            // Refresh the page to show the new poll
            setTimeout(() => window.location.reload(), 1000);
          }} />
        )}
      </main>
    </div>
  );
}
