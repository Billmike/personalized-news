import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase.from('User').select('*') as never;

    if (error) throw error;

    return NextResponse.json({
      data,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Unable to fetch users' }, { status: 500 });
  }
}
