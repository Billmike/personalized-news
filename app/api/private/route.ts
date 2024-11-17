import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  const userEmail = req.headers.get('x-user-email');

  return NextResponse.json({
    message: 'Protected route accessed',
    user: { id: userId, email: userEmail },
  });
}
