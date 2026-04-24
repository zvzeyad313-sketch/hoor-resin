'use client';

import { useState } from 'react';
import { updateOrder, deleteOrder } from '@/app/admin/actions';

export default function OrdersTable({ orders }: { orders: any[] }) {
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editOrderData, setEditOrderData] = useState({ name: '', address: '', status: '' });
  const [savingOrderId, setSavingOrderId] = useState<string | null>(null);

  const handleEditOrder = (order: any) => {
    setEditingOrderId(order.id);
    setEditOrderData({
      name: order.customer_name || '',
      address: order.customer_address || '',
      status: order.status || 'pending'
    });
  };

  const handleSaveOrder = async (id: string) => {
    setSavingOrderId(id);
    try {
      await updateOrder(id, editOrderData.name, editOrderData.address, editOrderData.status);
      setEditingOrderId(null);
    } catch (err: any) {
      alert(`خطأ أثناء الحفظ: ${err.message}`);
    }
    setSavingOrderId(null);
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الطلب نهائياً؟')) return;
    setSavingOrderId(id);
    try {
      await deleteOrder(id);
    } catch (err: any) {
      alert(`خطأ أثناء الحذف: ${err.message}`);
    }
    setSavingOrderId(null);
  };

  return (
    <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4', textAlign: 'right' }}>
            <th style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>رقم الطلب</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>التاريخ</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>المنتجات</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>العميل</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>الإجمالي</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>الحالة</th>
            <th style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order.id}>
              <td style={{ padding: '1rem', borderBottom: '1px solid #ddd', fontSize: '1.1rem', fontWeight: 'bold' }}>#{orders.length - index}</td>
              <td suppressHydrationWarning style={{ padding: '1rem', borderBottom: '1px solid #ddd', direction: 'ltr', textAlign: 'right', whiteSpace: 'nowrap' }}>
                {order.created_at ? new Date(order.created_at).toLocaleString('ar-EG') : '-'}
              </td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #ddd', maxWidth: '300px' }}>
                <div style={{ maxHeight: '150px', overflowY: 'auto', fontSize: '0.85rem' }}>
                  {(() => {
                    try {
                      const parsedItems = JSON.parse(order.items);
                      if (Array.isArray(parsedItems)) {
                        return (
                          <ul style={{ paddingRight: '1.2rem', margin: 0 }}>
                            {parsedItems.map((item: any, idx: number) => (
                              <li key={idx} style={{ marginBottom: '0.5rem' }}>
                                <strong>{item.name}</strong> - {item.price} ج.م
                                {item.description && <div style={{ color: '#555', fontSize: '0.8rem', marginTop: '2px' }}>{item.description}</div>}
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{order.items}</pre>;
                    } catch (e) {
                      return <pre style={{ margin: 0, fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>{order.items}</pre>;
                    }
                  })()}
                </div>
              </td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                {editingOrderId === order.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <input type="text" placeholder="الاسم" value={editOrderData.name} onChange={e => setEditOrderData({...editOrderData, name: e.target.value})} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} />
                    <textarea placeholder="العنوان بالتفصيل" value={editOrderData.address} onChange={e => setEditOrderData({...editOrderData, address: e.target.value})} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }} />
                  </div>
                ) : (
                  <div style={{ fontSize: '0.9rem' }}>
                    <div style={{ marginBottom: '4px' }}><strong>الاسم:</strong> {order.customer_name || <span style={{color: '#999'}}>غير محدد</span>}</div>
                    <div><strong>العنوان:</strong> {order.customer_address || <span style={{color: '#999'}}>غير محدد</span>}</div>
                  </div>
                )}
              </td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap' }}>{order.total} ج.م</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                {editingOrderId === order.id ? (
                  <select value={editOrderData.status} onChange={e => setEditOrderData({...editOrderData, status: e.target.value})} style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}>
                    <option value="pending">قيد الانتظار</option>
                    <option value="delivery">جاري التوصيل</option>
                    <option value="done">مكتمل</option>
                  </select>
                ) : (
                  <span style={{
                    padding: '0.3rem 0.6rem', 
                    borderRadius: '50px', 
                    fontSize: '0.85rem', 
                    fontWeight: 'bold',
                    display: 'inline-block',
                    whiteSpace: 'nowrap',
                    backgroundColor: order.status === 'done' ? '#dcfce7' : order.status === 'delivery' ? '#fef08a' : '#fce7f3',
                    color: order.status === 'done' ? '#166534' : order.status === 'delivery' ? '#854d0e' : '#9d174d'
                  }}>
                    {order.status === 'done' ? 'مكتمل' : order.status === 'delivery' ? 'جاري التوصيل' : 'قيد الانتظار'}
                  </span>
                )}
              </td>
              <td style={{ padding: '1rem', borderBottom: '1px solid #ddd' }}>
                {editingOrderId === order.id ? (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleSaveOrder(order.id)} disabled={savingOrderId === order.id} style={{ padding: '0.4rem 0.8rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: savingOrderId === order.id ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                      حفظ
                    </button>
                    <button onClick={() => setEditingOrderId(null)} disabled={savingOrderId === order.id} style={{ padding: '0.4rem 0.8rem', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      إلغاء
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => handleEditOrder(order)} disabled={savingOrderId === order.id} style={{ padding: '0.4rem 0.8rem', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontFamily: 'inherit' }}>
                      تعديل
                    </button>
                    <button onClick={() => handleDeleteOrder(order.id)} disabled={savingOrderId === order.id} style={{ padding: '0.4rem 0.8rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: savingOrderId === order.id ? 'not-allowed' : 'pointer', opacity: savingOrderId === order.id ? 0.5 : 1, fontFamily: 'inherit' }}>
                      حذف
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: '2rem', textAlign: 'center' }}>لا توجد طلبات بعد</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
