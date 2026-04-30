import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, total, customer_name, customer_phone, customer_address, notes } = body;
    
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
      // If no Supabase URL is set yet, just mock success so the WhatsApp redirect still works
      console.warn('Supabase not configured. Mocking success.');
      return NextResponse.json({ success: true, mocked: true });
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([
        { 
          items: JSON.stringify(items), 
          total, 
          customer_name,
          customer_phone,
          customer_address,
          notes,
          status: 'pending'
        }
      ]);
      
    if (error) {
      console.error('Supabase DB Error:', error);
      return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
    }
    
    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
