import { NextRequest } from 'next/server';
import { getUser, createUser } from './database';
import { User } from './types';

export interface AuthenticatedUser extends User {
  // Additional auth-specific fields can be added here
}

// Simple authentication using MiniKit context
// In production, this should be replaced with proper JWT or session-based auth
export async function authenticateUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    // Get user ID from headers (set by MiniKit)
    const userId = request.headers.get('x-user-id');
    const walletAddress = request.headers.get('x-wallet-address');
    const farcasterId = request.headers.get('x-farcaster-id');

    if (!userId) {
      return null;
    }

    // Try to find existing user
    let user = await getUser(userId);

    if (!user) {
      // Create new user if they don't exist
      user = await createUser({
        userId,
        walletAddress: walletAddress || undefined,
        farcasterId: farcasterId || undefined,
        tokenBalance: 0
      });
    }

    return user as AuthenticatedUser;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// Middleware to set user context from MiniKit
export async function setUserContext(request: NextRequest): Promise<NextRequest> {
  // This would be called by middleware to set user headers
  // In a real implementation, you'd verify the MiniKit session here
  return request;
}

// Generate a simple session token (for demo purposes)
// In production, use proper JWT tokens
export function generateSessionToken(userId: string): string {
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

export function verifySessionToken(token: string): string | null {
  try {
    const decoded = Buffer.from(token, 'base64').toString();
    const [userId] = decoded.split(':');
    return userId;
  } catch {
    return null;
  }
}

// Telegram authentication helper
export async function authenticateTelegramUser(telegramId: string, username?: string): Promise<AuthenticatedUser | null> {
  try {
    const userId = `telegram_${telegramId}`;
    let user = await getUser(userId);

    if (!user) {
      user = await createUser({
        userId,
        tokenBalance: 0
      });
    }

    return user as AuthenticatedUser;
  } catch (error) {
    console.error('Telegram authentication error:', error);
    return null;
  }
}

// Farcaster authentication helper
export async function authenticateFarcasterUser(farcasterId: string, walletAddress?: string): Promise<AuthenticatedUser | null> {
  try {
    const userId = `farcaster_${farcasterId}`;
    let user = await getUser(userId);

    if (!user) {
      user = await createUser({
        userId,
        farcasterId,
        walletAddress,
        tokenBalance: 0
      });
    }

    return user as AuthenticatedUser;
  } catch (error) {
    console.error('Farcaster authentication error:', error);
    return null;
  }
}

