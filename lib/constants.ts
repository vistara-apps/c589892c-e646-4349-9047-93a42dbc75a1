export const POLL_THEMES = [
  { id: 'default', name: 'Default', color: 'hsl(210, 70%, 50%)' },
  { id: 'green', name: 'Green', color: 'hsl(160, 70%, 50%)' },
  { id: 'purple', name: 'Purple', color: 'hsl(270, 70%, 50%)' },
  { id: 'orange', name: 'Orange', color: 'hsl(30, 70%, 50%)' },
  { id: 'red', name: 'Red', color: 'hsl(0, 70%, 50%)' },
];

export const POLL_DURATIONS = [
  { value: 1, label: '1 hour' },
  { value: 6, label: '6 hours' },
  { value: 24, label: '1 day' },
  { value: 72, label: '3 days' },
  { value: 168, label: '1 week' },
];

export const TOKEN_REWARDS = {
  VOTE: 10,
  CREATE_POLL: 50,
  REFERRAL: 100,
  DAILY_BONUS: 25,
};

export const MOCK_POLLS = [
  {
    pollId: '1',
    creatorId: 'user1',
    question: 'What\'s your favorite DeFi protocol on Base?',
    options: [
      { id: '1', text: 'Uniswap', votes: 45, percentage: 45 },
      { id: '2', text: 'Aerodrome', votes: 30, percentage: 30 },
      { id: '3', text: 'Compound', votes: 15, percentage: 15 },
      { id: '4', text: 'Other', votes: 10, percentage: 10 },
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    expiresAt: new Date(Date.now() + 22 * 60 * 60 * 1000), // 22 hours from now
    isPublic: true,
    totalVotes: 100,
    creator: {
      displayName: 'CryptoEnthusiast',
      avatar: '🚀',
    },
  },
  {
    pollId: '2',
    creatorId: 'user2',
    question: 'Which Base ecosystem project are you most excited about?',
    options: [
      { id: '1', text: 'Friend.tech', votes: 35, percentage: 58.3 },
      { id: '2', text: 'Farcaster', votes: 20, percentage: 33.3 },
      { id: '3', text: 'Coinbase Wallet', votes: 5, percentage: 8.3 },
    ],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    expiresAt: new Date(Date.now() + 20 * 60 * 60 * 1000), // 20 hours from now
    isPublic: true,
    totalVotes: 60,
    creator: {
      displayName: 'BaseBuilder',
      avatar: '🔵',
    },
  },
  {
    pollId: '3',
    creatorId: 'user3',
    question: 'What feature should PollPulse add next?',
    options: [
      { id: '1', text: 'NFT rewards', votes: 25, percentage: 50 },
      { id: '2', text: 'Poll analytics', votes: 15, percentage: 30 },
      { id: '3', text: 'Group polls', votes: 10, percentage: 20 },
    ],
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    expiresAt: new Date(Date.now() + 23 * 60 * 60 * 1000), // 23 hours from now
    isPublic: true,
    totalVotes: 50,
    creator: {
      displayName: 'ProductManager',
      avatar: '📊',
    },
  },
];
