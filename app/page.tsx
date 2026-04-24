import { supabase } from '@/lib/supabase';
import StoreFront from '@/components/StoreFront';

export const revalidate = 0; // Disable caching to fetch live products

export default async function Home() {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
  }

  // Fallback to empty array if no products yet
  const safeProducts = products || [];

  return <StoreFront initialProducts={safeProducts} />;
}
