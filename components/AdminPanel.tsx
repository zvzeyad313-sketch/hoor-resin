'use client';

import { useState } from 'react';
import OrdersTable from './admin/OrdersTable';
import ProductManagement from './admin/ProductManagement';
import { logoutAdmin } from '@/app/admin/actions';
import { useRouter } from 'next/navigation';

export default function AdminPanel({ orders, products }: { orders: any[], products: any[] }) {
  const [tab, setTab] = useState<'orders' | 'products'>('orders');
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.refresh();
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', direction: 'rtl', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>لوحة التحكم</h1>
        <button 
          onClick={handleLogout}
          style={{ padding: '0.5rem 1rem', background: '#374151', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
        >
          تسجيل الخروج
        </button>
      </div>
      
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setTab('orders')} 
          style={{ 
            fontWeight: tab === 'orders' ? 'bold' : 'normal', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1.2rem', 
            padding: '0.5rem 1rem', 
            borderRadius: '8px', 
            backgroundColor: tab === 'orders' ? '#f0f0f0' : 'transparent' 
          }}
        >
          الطلبات
        </button>
        <button 
          onClick={() => setTab('products')} 
          style={{ 
            fontWeight: tab === 'products' ? 'bold' : 'normal', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '1.2rem', 
            padding: '0.5rem 1rem', 
            borderRadius: '8px', 
            backgroundColor: tab === 'products' ? '#f0f0f0' : 'transparent' 
          }}
        >
          المنتجات
        </button>
      </div>

      {tab === 'orders' && <OrdersTable orders={orders} />}
      {tab === 'products' && <ProductManagement products={products} />}
    </div>
  );
}
