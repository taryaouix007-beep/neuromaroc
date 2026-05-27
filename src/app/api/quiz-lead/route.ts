import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, score, results } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('quiz_leads')
      .insert([
        { 
          email, 
          name, 
          quiz_score: score, 
          quiz_results: results 
        },
      ]);

    if (error) throw error;

    return NextResponse.json({ message: 'Lead captured successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Quiz Lead Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
