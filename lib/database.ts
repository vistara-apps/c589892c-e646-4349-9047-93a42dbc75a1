import fs from 'fs';
import path from 'path';
import { User, Poll, Vote, TokenTransaction, CreatePollData } from './types';
import { generatePollId, calculatePercentages } from './utils';
import { TOKEN_REWARDS } from './constants';

const DB_PATH = path.join(process.cwd(), 'lib', 'database.json');

// Initialize database if it doesn't exist
function initializeDatabase() {
  if (!fs.existsSync(DB_PATH)) {
    const initialData = {
      users: [] as User[],
      polls: [] as Poll[],
      votes: [] as Vote[],
      tokenTransactions: [] as TokenTransaction[],
      lastUpdated: new Date().toISOString()
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
  }
}

// Read database
function readDatabase() {
  initializeDatabase();
  const data = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(data);
}

// Write database
function writeDatabase(data: any) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// User operations
export async function getUser(userId: string): Promise<User | null> {
  const db = readDatabase();
  return db.users.find((user: User) => user.userId === userId) || null;
}

export async function createUser(userData: Partial<User>): Promise<User> {
  const db = readDatabase();
  const newUser: User = {
    userId: userData.userId || generatePollId(),
    walletAddress: userData.walletAddress,
    farcasterId: userData.farcasterId,
    tokenBalance: userData.tokenBalance || 0,
    createdAt: new Date()
  };

  db.users.push(newUser);
  writeDatabase(db);
  return newUser;
}

export async function updateUserTokenBalance(userId: string, amount: number): Promise<User | null> {
  const db = readDatabase();
  const userIndex = db.users.findIndex((user: User) => user.userId === userId);

  if (userIndex === -1) return null;

  db.users[userIndex].tokenBalance += amount;
  writeDatabase(db);
  return db.users[userIndex];
}

// Poll operations
export async function getPolls(filter: string = 'all', limit: number = 20, offset: number = 0): Promise<Poll[]> {
  const db = readDatabase();
  let polls = [...db.polls];

  // Filter polls
  const now = new Date();
  switch (filter) {
    case 'trending':
      polls = polls.sort((a, b) => b.totalVotes - a.totalVotes);
      break;
    case 'recent':
      polls = polls.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'active':
      polls = polls.filter(poll => new Date(poll.expiresAt) > now);
      break;
    default:
      // 'all' - no filtering
      break;
  }

  // Apply pagination
  return polls.slice(offset, offset + limit);
}

export async function getPoll(pollId: string): Promise<Poll | null> {
  const db = readDatabase();
  return db.polls.find((poll: Poll) => poll.pollId === pollId) || null;
}

export async function createPoll(creatorId: string, pollData: CreatePollData): Promise<Poll> {
  const db = readDatabase();

  const newPoll: Poll = {
    pollId: generatePollId(),
    creatorId,
    question: pollData.question,
    options: pollData.options
      .filter(opt => opt.trim())
      .map((opt, index) => ({
        id: (index + 1).toString(),
        text: opt.trim(),
        votes: 0,
        percentage: 0,
      })),
    theme: pollData.theme,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + pollData.duration * 60 * 60 * 1000),
    isPublic: pollData.isPublic,
    totalVotes: 0,
  };

  db.polls.push(newPoll);
  writeDatabase(db);

  // Award tokens for creating poll
  await updateUserTokenBalance(creatorId, TOKEN_REWARDS.CREATE_POLL);

  // Record token transaction
  await createTokenTransaction({
    txId: generatePollId(),
    toUserId: creatorId,
    amount: TOKEN_REWARDS.CREATE_POLL,
    type: 'create_reward',
    timestamp: new Date()
  });

  return newPoll;
}

// Vote operations
export async function createVote(userId: string, pollId: string, optionId: string): Promise<Vote | null> {
  const db = readDatabase();

  // Check if user already voted
  const existingVote = db.votes.find(
    (vote: Vote) => vote.userId === userId && vote.pollId === pollId
  );

  if (existingVote) {
    return null; // User already voted
  }

  // Check if poll exists and is not expired
  const poll = db.polls.find((p: Poll) => p.pollId === pollId);
  if (!poll || new Date(poll.expiresAt) <= new Date()) {
    return null; // Poll not found or expired
  }

  const newVote: Vote = {
    voteId: generatePollId(),
    userId,
    pollId,
    selectedOption: optionId,
    votedAt: new Date()
  };

  db.votes.push(newVote);

  // Update poll vote count
  const pollIndex = db.polls.findIndex((p: Poll) => p.pollId === pollId);
  if (pollIndex !== -1) {
    const optionIndex = db.polls[pollIndex].options.findIndex(opt => opt.id === optionId);
    if (optionIndex !== -1) {
      db.polls[pollIndex].options[optionIndex].votes += 1;
      db.polls[pollIndex].totalVotes += 1;

      // Recalculate percentages
      db.polls[pollIndex].options = calculatePercentages(db.polls[pollIndex].options);
    }
  }

  writeDatabase(db);

  // Award tokens for voting
  await updateUserTokenBalance(userId, TOKEN_REWARDS.VOTE);

  // Record token transaction
  await createTokenTransaction({
    txId: generatePollId(),
    toUserId: userId,
    amount: TOKEN_REWARDS.VOTE,
    type: 'vote_reward',
    timestamp: new Date()
  });

  return newVote;
}

export async function getPollVotes(pollId: string): Promise<Vote[]> {
  const db = readDatabase();
  return db.votes.filter((vote: Vote) => vote.pollId === pollId);
}

// Token transaction operations
export async function createTokenTransaction(transaction: Omit<TokenTransaction, 'timestamp'> & { timestamp?: Date }): Promise<TokenTransaction> {
  const db = readDatabase();

  const newTransaction: TokenTransaction = {
    ...transaction,
    timestamp: transaction.timestamp || new Date()
  };

  db.tokenTransactions.push(newTransaction);
  writeDatabase(db);
  return newTransaction;
}

export async function getUserTokenTransactions(userId: string): Promise<TokenTransaction[]> {
  const db = readDatabase();
  return db.tokenTransactions.filter(
    (tx: TokenTransaction) => tx.fromUserId === userId || tx.toUserId === userId
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Analytics
export async function getPollAnalytics(pollId: string) {
  const db = readDatabase();
  const poll = db.polls.find((p: Poll) => p.pollId === pollId);

  if (!poll) return null;

  const votes = db.votes.filter((vote: Vote) => vote.pollId === pollId);
  const voteCountByHour = votes.reduce((acc, vote) => {
    const hour = new Date(vote.votedAt).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  return {
    poll,
    totalVotes: poll.totalVotes,
    uniqueVoters: new Set(votes.map(v => v.userId)).size,
    voteDistribution: poll.options.map(opt => ({
      option: opt.text,
      votes: opt.votes,
      percentage: opt.percentage
    })),
    voteTimeline: voteCountByHour
  };
}

