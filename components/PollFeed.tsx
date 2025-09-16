'use client';

import { useState, useEffect } from 'react';
import { Poll } from '../lib/types';
import { TOKEN_REWARDS } from '../lib/constants';
import { PollCard } from './PollCard';
import { LoadingSpinner } from './LoadingSpinner';

export function PollFeed() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trending' | 'recent'>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/polls?filter=${filter}&limit=20&offset=0`);
        const data = await response.json();

        if (data.success) {
          setPolls(data.data);
        } else {
          setError(data.error || 'Failed to fetch polls');
        }
      } catch (err) {
        console.error('Error fetching polls:', err);
        setError('Failed to load polls. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolls();
  }, [filter]);

  const handleVote = async (pollId: string, optionId: string) => {
    try {
      const response = await fetch(`/api/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ optionId }),
      });

      const data = await response.json();

      if (data.success) {
        // Update local poll data
        setPolls(prevPolls =>
          prevPolls.map(poll => {
            if (poll.pollId === pollId) {
              const updatedOptions = poll.options.map(option => {
                if (option.id === optionId) {
                  return { ...option, votes: option.votes + 1 };
                }
                return option;
              });

              const totalVotes = updatedOptions.reduce((sum, opt) => sum + opt.votes, 0);
              const optionsWithPercentages = updatedOptions.map(option => ({
                ...option,
                percentage: Math.round((option.votes / totalVotes) * 100),
              }));

              return {
                ...poll,
                options: optionsWithPercentages,
                totalVotes,
              };
            }
            return poll;
          })
        );

        // Show success message
        console.log(`Earned ${TOKEN_REWARDS.VOTE} tokens for voting!`);
      } else {
        setError(data.error || 'Failed to record vote');
      }
    } catch (err) {
      console.error('Error voting:', err);
      setError('Failed to record vote. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-500 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">Error Loading Polls</h3>
        <p className="text-text-secondary mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex space-x-1 bg-surface rounded-lg p-1">
        {[
          { key: 'all', label: 'All Polls' },
          { key: 'trending', label: 'Trending' },
          { key: 'recent', label: 'Recent' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as typeof filter)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
              filter === key
                ? 'bg-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Polls List */}
      <div className="space-y-4">
        {polls.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">No polls found</h3>
            <p className="text-text-secondary">Be the first to create a poll and start earning tokens!</p>
          </div>
        ) : (
          polls.map((poll) => (
            <PollCard
              key={poll.pollId}
              poll={poll}
              onVote={handleVote}
            />
          ))
        )}
      </div>

      {/* Load More Button */}
      {polls.length > 0 && (
        <div className="text-center pt-6">
          <button className="btn-secondary">
            Load More Polls
          </button>
        </div>
      )}
    </div>
  );
}
