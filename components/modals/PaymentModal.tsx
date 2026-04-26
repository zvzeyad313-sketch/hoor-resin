'use client';

import { Product } from '@/lib/types';

type PaymentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isOrdering: boolean;
  handleLinkHover: (t: boolean) => void;
};

export default function PaymentModal({
  isOpen,
  onClose,
  onConfirm,
  isOrdering,
  handleLinkHover
}: PaymentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="artisan-modal-overlay open" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="artisan-modal">
        <div className="artisan-modal-header">
          <button 
            className="btn-close" 
            onClick={onClose} 
            onMouseEnter={() => handleLinkHover(true)} 
            onMouseLeave={() => handleLinkHover(false)}
            aria-label="Close"
          >✕</button>
          <h2 className="display-lg">طرق الدفع</h2>
        </div>
        
        <div className="artisan-modal-body">
          <div className="payment-info" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <p className="body-lg">يمكنك إتمام الدفع من خلال الوسائل التالية:</p>
            
            <div className="payment-method">
              <h3 style={{ marginBottom: '0.5rem' }}>📱 Orange Cash</h3>
              <p className="amount" style={{ fontSize: '1.25rem', color: 'var(--gold)', fontWeight: 700 }}>01207147650</p>
            </div>

            <div className="payment-method">
              <h3 style={{ marginBottom: '0.5rem' }}>🏦 حساب بنكي</h3>
              <p>اسم البنك: مثال بنك مصر</p>
              <p>رقم الحساب: 123456789</p>
              <p>IBAN: EGXXXXXXXXXXXXXXXXXXXX</p>
            </div>
            
            <p className="body-lg" style={{ opacity: 0.6, fontSize: '0.85rem' }}>
              بعد التحويل، اضغطي على الزر أدناه لإرسال صورة الدفع عبر واتساب وتأكيد الطلب.
            </p>
          </div>
        </div>

        <div className="artisan-modal-footer">
          <button 
            className="btn-primary-artisan" 
            onClick={onConfirm}
            disabled={isOrdering}
            onMouseEnter={() => handleLinkHover(true)} 
            onMouseLeave={() => handleLinkHover(false)}
          >
            <span>{isOrdering ? 'جاري التأكيد...' : 'تأكيد الدفع عبر واتساب'}</span>
            <span>✦</span>
          </button>
        </div>
      </div>
    </div>
  );
}
