import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';
import { hashPassword } from '@/app/lib/auth';

export async function POST(req: Request) {
  const { email, password } = await req.json();

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

  return NextResponse.json({ id: newUser.id, email: newUser.email });
}
