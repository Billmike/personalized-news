import { NextResponse } from 'next/server';
import { verifyToken } from '@/app/lib/auth';

export function middleware(req: Request) {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload = verifyToken(token) as any;

  if (!payload) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  // Pass user info to the request
  req.headers.set('x-user-id', payload.id);
  req.headers.set('x-user-email', payload.email);

  return NextResponse.next();
}

// Protect specific routes
export const config = {
  matcher: ['/api/private/:path*'],
};
