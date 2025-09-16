export interface User {
  userId: string;
  walletAddress?: string;
  farcasterId?: string;
  tokenBalance: number;
  createdAt: Date;
}

export interface Poll {
  pollId: string;
  creatorId: string;
  question: string;
  options: PollOption[];
  theme?: string;
  createdAt: Date;
  expiresAt: Date;
  isPublic: boolean;
  totalVotes: number;
  creator?: {
    displayName: string;
    avatar?: string;
  };
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  percentage: number;
}

export interface Vote {
  voteId: string;
  userId: string;
  pollId: string;
  selectedOption: string;
  votedAt: Date;
}

export interface TokenTransaction {
  txId: string;
  fromUserId?: string;
  toUserId: string;
  amount: number;
  type: 'vote_reward' | 'create_reward' | 'referral_bonus' | 'boost_payment';
  timestamp: Date;
}

export interface CreatePollData {
  question: string;
  options: string[];
  duration: number; // in hours
  isPublic: boolean;
  theme?: string;
}
