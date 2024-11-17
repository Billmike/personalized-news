import { NextResponse } from 'next/server';
import {prisma} from '@/app/lib/prisma';
import { verifyPassword, generateToken } from '@/app/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

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

  return NextResponse.json({ token });
}
