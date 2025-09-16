import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add user context headers for MiniKit authentication
  // In a real implementation, you would verify the MiniKit session here
  const response = NextResponse.next();

  // For demo purposes, we'll set mock user headers
  // In production, these would come from MiniKit session validation
  response.headers.set('x-user-id', 'demo-user-123');
  response.headers.set('x-wallet-address', '0x742d35Cc6634C0532925a3b844Bc454e4438f44e');
  response.headers.set('x-farcaster-id', 'demo-farcaster-456');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

