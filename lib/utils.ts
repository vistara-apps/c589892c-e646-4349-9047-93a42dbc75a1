import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) {
    return 'Expired';
  }
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h remaining`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
}

export function formatTokenAmount(amount: number): string {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}K`;
  }
  return amount.toString();
}

export function generatePollId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function calculatePercentages(options: { votes: number }[]): { votes: number; percentage: number }[] {
  const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);
  
  return options.map(option => ({
    ...option,
    percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0,
  }));
}

export function isValidPollData(data: {
  question: string;
  options: string[];
  duration: number;
}): boolean {
  return (
    data.question.trim().length > 0 &&
    data.options.length >= 2 &&
    data.options.length <= 6 &&
    data.options.every(option => option.trim().length > 0) &&
    data.duration > 0
  );
}
