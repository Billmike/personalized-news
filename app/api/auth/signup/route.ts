import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { generateToken, hashPassword } from '@/app/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ error: 'Invalid email and password' }, { status: 400 });
  }

  // Hash password and create user
  const hashedPassword = await hashPassword(password);
  
  const newUser = await prisma.user.create({
    data: { email, password: hashedPassword } as never,
  });

  const token = generateToken(newUser);

  const response = NextResponse.json({
    success: true,
    message: 'Signup successful'
  });

  response.cookies.set('_personalised_news_xauth_status', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60,
    sameSite: 'strict',
    path: '/'
  });

  return response;
  } catch (error) {
    console.error('Error signing up:', error);

    return NextResponse.json({
      error: 'Something went wrong'
    }, {
      status: 500
    })
  }
}
