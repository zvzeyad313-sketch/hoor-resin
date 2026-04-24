'use client';

import { useState } from 'react';
import { addProduct, deleteProduct } from '@/app/admin/actions';

export default function ProductManagement({ products }: { products: any[] }) {
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return;
    setDeletingId(id);
    try {
      await deleteProduct(id, imageUrl);
    } catch (err: any) {
      alert(`خطأ: ${err.message}`);
    }
    setDeletingId(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addProduct(formData);
      alert('تمت إضافة المنتج بنجاح!');
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      alert(`حدث خطأ أثناء إضافة المنتج: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
      <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
        <h2>إضافة منتج جديد</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>اسم المنتج</label>
            <input name="name" required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>الوصف</label>
            <textarea name="description" required rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>السعر (ج.م)</label>
            <input name="price" type="number" required style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>التصنيف (الحالة)</label>
            <select name="category" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}>
              <option value="">عادي</option>
              <option value="new">جديد</option>
              <option value="sale">خصم</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>صورة المنتج</label>
            <input name="image" type="file" accept="image/*" style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }} />
          </div>
          
          <button type="submit" disabled={loading} style={{ padding: '1rem', background: '#000', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', color: '#fff', borderRadius: '4px', fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem' }}>
            {loading ? 'جاري الإضافة...' : 'حفظ المنتج ✦'}
          </button>
        </form>
      </div>

      <div>
        <h2>المنتجات الحالية</h2>
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f4f4f4', textAlign: 'right' }}>
                <th style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>الصورة</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>الاسم</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>السعر</th>
                <th style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    {product.image_url ? 
                      <img src={product.image_url} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /> 
                      : 'بدون صورة'}
                  </td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{product.name}</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>{product.price} ج.م</td>
                  <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                    <button 
                      onClick={() => handleDelete(product.id, product.image_url)} 
                      disabled={deletingId === product.id}
                      style={{ padding: '0.4rem 0.8rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: deletingId === product.id ? 'not-allowed' : 'pointer' }}
                    >
                      {deletingId === product.id ? 'جاري الحذف...' : 'حذف'}
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>لا توجد منتجات بعد</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
