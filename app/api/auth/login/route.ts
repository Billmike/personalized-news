import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { verifyPassword, generateToken } from '@/app/lib/auth';

export async function POST(req: Request) {
  try {

    const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Find user by email
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Verify password
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isPasswordValid = await verifyPassword(password, (user as any).password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Generate JWT token
  const token = generateToken({ id: user.id, email: user.email });

  const response = NextResponse.json({
    success: true,
    message: 'Login successful'
  }, {
    status: 200
  });

  response.cookies.set('_personalised_news_xauth_status', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60,
    sameSite: 'strict',
    path: '/'
  });

  return response;
    
  } catch (error: unknown) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
  
}
