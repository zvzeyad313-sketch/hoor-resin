import { supabase } from '@/lib/supabase';
import AdminPanel from '@/components/AdminPanel';
import AdminLogin from '@/components/AdminLogin';
import { cookies } from 'next/headers';

export const revalidate = 0;

export default async function AdminDashboard() {
  const cookieStore = cookies();
  const isAdmin = cookieStore.get('admin_session')?.value === 'true';

  if (!isAdmin) {
    return <AdminLogin />;
  }

  // Optionally verify admin role
  // const { data: profile } = await supabaseAuth.from('profiles').select('role').eq('id', session.user.id).single();
  // if (profile?.role !== 'admin') redirect('/unauthorized');

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  let errorMessage = null;
  if (ordersError) errorMessage = `Orders Error: ${ordersError.message}`;
  if (productsError) errorMessage = `${errorMessage ? errorMessage + ' | ' : ''}Products Error: ${productsError.message}`;

  if (errorMessage) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'sans-serif', direction: 'rtl', color: 'red' }}>
        <h2>حدث خطأ أثناء تحميل البيانات</h2>
        <p>{errorMessage}</p>
        <p>يرجى التأكد من إعداد رابط ومشتاح Supabase بشكل صحيح في ملف .env.local أو في إعدادات Vercel.</p>
      </div>
    );
  }

  return <AdminPanel orders={orders || []} products={products || []} />;
}
