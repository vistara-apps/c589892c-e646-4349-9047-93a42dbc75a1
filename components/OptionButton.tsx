'use client';

import { PollOption } from '../lib/types';

interface OptionButtonProps {
  option: PollOption;
  isSelected: boolean;
  hasVoted: boolean;
  isVoting: boolean;
  isDisabled: boolean;
  onClick: () => void;
}

export function OptionButton({
  option,
  isSelected,
  hasVoted,
  isVoting,
  isDisabled,
  onClick,
}: OptionButtonProps) {
  const getVariantClasses = () => {
    if (isVoting && isSelected) {
      return 'bg-primary bg-opacity-20 border-primary text-primary animate-pulse';
    }
    if (hasVoted && isSelected) {
      return 'bg-accent bg-opacity-20 border-accent text-accent';
    }
    if (hasVoted) {
      return 'bg-surface border-gray-600 text-text-secondary cursor-default';
    }
    if (isDisabled) {
      return 'bg-surface border-gray-600 text-text-secondary cursor-not-allowed opacity-50';
    }
    return 'bg-surface border-gray-600 text-text-primary hover:border-primary hover:bg-primary hover:bg-opacity-10 cursor-pointer';
  };

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full p-4 rounded-md border-2 transition-all duration-200 text-left relative overflow-hidden ${getVariantClasses()}`}
    >
      {/* Progress bar background for voted options */}
      {hasVoted && (
        <div
          className="absolute inset-0 bg-primary bg-opacity-10 transition-all duration-300"
          style={{ width: `${option.percentage}%` }}
        />
      )}
      
      <div className="relative flex items-center justify-between">
        <span className="font-medium">{option.text}</span>
        <div className="flex items-center space-x-2">
          {hasVoted && (
            <span className="text-sm font-semibold">
              {option.percentage}%
            </span>
          )}
          {isVoting && isSelected && (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
          {hasVoted && isSelected && (
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
