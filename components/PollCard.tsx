'use client';

import { useState } from 'react';
import { Poll } from '../lib/types';
import { formatTimeRemaining } from '../lib/utils';
import { OptionButton } from './OptionButton';

interface PollCardProps {
  poll: Poll;
  variant?: 'default' | 'compact';
  onVote?: (pollId: string, optionId: string) => void;
}

export function PollCard({ poll, variant = 'default', onVote }: PollCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (optionId: string) => {
    if (hasVoted || isVoting) return;

    setIsVoting(true);
    setSelectedOption(optionId);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setHasVoted(true);
    setIsVoting(false);
    onVote?.(poll.pollId, optionId);
  };

  const isExpired = new Date() > poll.expiresAt;

  return (
    <div className={`card animate-fade-in ${variant === 'compact' ? 'p-4' : ''}`}>
      {/* Poll Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-sm font-bold">
            {poll.creator?.avatar || '👤'}
          </div>
          <div>
            <p className="font-medium text-text-primary">
              {poll.creator?.displayName || 'Anonymous'}
            </p>
            <p className="text-xs text-text-secondary">
              {formatTimeRemaining(poll.expiresAt)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-text-primary">
            {poll.totalVotes} votes
          </p>
        </div>
      </div>

      {/* Poll Question */}
      <h3 className="text-lg font-semibold text-text-primary mb-4 leading-tight">
        {poll.question}
      </h3>

      {/* Poll Options */}
      <div className="space-y-3 mb-4">
        {poll.options.map((option) => (
          <OptionButton
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            hasVoted={hasVoted}
            isVoting={isVoting && selectedOption === option.id}
            isDisabled={isExpired || hasVoted || isVoting}
            onClick={() => handleVote(option.id)}
          />
        ))}
      </div>

      {/* Poll Footer */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-1 hover:text-text-primary transition-colors duration-200">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>Share</span>
          </button>
          {hasVoted && (
            <div className="flex items-center space-x-1 text-accent">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span>+10 tokens earned</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
