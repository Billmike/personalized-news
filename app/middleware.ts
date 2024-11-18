import { NextResponse, NextRequest } from 'next/server';
import { verifyToken } from '@/app/lib/auth';

export function middleware(req: NextRequest) {
  const authToken = req.cookies.get('_personalised_news_xauth_status')?.value;

  if (!authToken) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  try {
    const payload = verifyToken(authToken);
    
    if (!payload) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('JWT verification failed:', error);

    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
}

// Protect specific routes
export const config = {
  matcher: ['/'],
};
