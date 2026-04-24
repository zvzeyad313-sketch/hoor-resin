import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total } = body;
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // If no Supabase URL is set yet, just mock success so the WhatsApp redirect still works
      console.warn('Supabase not configured. Mocking success.');
      return NextResponse.json({ success: true, mocked: true });
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          // We assume 'items' is a column that can store text or jsonb
          items: JSON.stringify(items), 
          total, 
          status: 'pending'
          // created_at usually auto-generates
        }
      ]);
      
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
