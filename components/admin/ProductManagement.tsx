'use client';

import { useState } from 'react';
import { addProduct, deleteProduct, updateProduct } from '@/app/admin/actions';

export default function ProductManagement({ products }: { products: any[] }) {
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

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
      if (editingProduct) {
        await updateProduct(formData);
        alert('تم تحديث المنتج بنجاح!');
        setEditingProduct(null);
      } else {
        await addProduct(formData);
        alert('تمت إضافة المنتج بنجاح!');
        (e.target as HTMLFormElement).reset();
      }
    } catch (err: any) {
      alert(`حدث خطأ: ${err.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
      <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px' }}>
        <h2>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          {editingProduct && <input type="hidden" name="id" value={editingProduct.id} />}
          {editingProduct && <input type="hidden" name="existing_image_url" value={editingProduct.image_url} />}
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>اسم المنتج</label>
            <input 
              name="name" 
              required 
              defaultValue={editingProduct?.name || ''}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>الوصف</label>
            <textarea 
              name="description" 
              required 
              rows={3} 
              defaultValue={editingProduct?.description || ''}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>السعر (ج.م)</label>
            <input 
              name="price" 
              type="number" 
              required 
              defaultValue={editingProduct?.price || ''}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>التصنيف (الحالة)</label>
            <select 
              name="category" 
              defaultValue={editingProduct?.category || ''}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="">عادي</option>
              <option value="new">جديد</option>
              <option value="sale">خصم</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>صورة المنتج {editingProduct && '(اتركه فارغاً للحفاظ على الصورة الحالية)'}</label>
            <input 
              name="image" 
              type="file" 
              accept="image/*" 
              style={{ width: '100%', padding: '0.75rem', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }} 
            />
            {editingProduct?.image_url && (
              <img src={editingProduct.image_url} alt="Current" style={{ width: '50px', height: '50px', objectFit: 'cover', marginTop: '0.5rem', borderRadius: '4px' }} />
            )}
          </div>
          
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              type="submit" 
              disabled={loading} 
              style={{ 
                flex: 1,
                padding: '1rem', 
                background: editingProduct ? '#059669' : '#000', 
                border: 'none', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                color: '#fff', 
                borderRadius: '4px', 
                fontWeight: 'bold', 
                fontSize: '1rem' 
              }}
            >
              {loading ? (editingProduct ? 'جاري التحديث...' : 'جاري الإضافة...') : (editingProduct ? 'تحديث المنتج ✦' : 'حفظ المنتج ✦')}
            </button>
            {editingProduct && (
              <button 
                type="button" 
                onClick={() => setEditingProduct(null)}
                style={{ padding: '1rem', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                إلغاء
              </button>
            )}
          </div>
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
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => setEditingProduct(product)} 
                        style={{ padding: '0.4rem 0.8rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        تعديل
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id, product.image_url)} 
                        disabled={deletingId === product.id}
                        style={{ padding: '0.4rem 0.8rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: deletingId === product.id ? 'not-allowed' : 'pointer' }}
                      >
                        {deletingId === product.id ? 'جاري الحذف...' : 'حذف'}
                      </button>
                    </div>
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
