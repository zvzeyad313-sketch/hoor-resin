'use client';

import { useState } from 'react';
import { trackOrder } from '@/app/admin/actions';

type OrderTrackingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  handleLinkHover: (t: boolean) => void;
};

export default function OrderTrackingModal({ isOpen, onClose, handleLinkHover }: OrderTrackingModalProps) {
  const [orderId, setOrderId] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId) return;
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const result = await trackOrder(orderId);
      if (result.success) {
        setStatus(result.status);
      } else {
        setError('رقم الطلب غير موجود');
      }
    } catch (err) {
      setError('حدث خطأ أثناء البحث');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'قيد الانتظار';
      case 'delivery': return 'جاري التوصيل';
      case 'done': return 'مكتمل';
      default: return 'قيد المعالجة';
    }
  };

  return (
    <div className="artisan-modal-overlay open" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="artisan-modal" style={{ maxWidth: '450px' }}>
        <div className="artisan-modal-header">
          <button 
            className="btn-close" 
            onClick={onClose}
            onMouseEnter={() => handleLinkHover(true)} 
            onMouseLeave={() => handleLinkHover(false)}
          >✕</button>
          <h1 className="display-lg">تتبع الطلب</h1>
          <span className="label-sm">أدخل رقم الطلب الخاص بك</span>
        </div>

        <div className="artisan-modal-body">
          <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="input-group">
              <input 
                type="text" 
                placeholder="رقم الطلب (مثلاً: #12345)" 
                className="artisan-input"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn-primary-artisan"
              disabled={loading}
              onMouseEnter={() => handleLinkHover(true)} 
              onMouseLeave={() => handleLinkHover(false)}
            >
              <span>{loading ? 'جاري البحث...' : 'بحث'}</span>
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            {status && (
              <div style={{ padding: '1.5rem', borderRadius: '12px', background: '#f0f9ff', color: '#0369a1' }}>
                <h3 className="body-lg" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>حالة الطلب:</h3>
                <p className="display-lg" style={{ fontSize: '1.5rem' }}>{getStatusText(status)}</p>
              </div>
            )}
            {error && (
              <div style={{ padding: '1rem', borderRadius: '12px', background: '#fef2f2', color: '#b91c1c' }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
