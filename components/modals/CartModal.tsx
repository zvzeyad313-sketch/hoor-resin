'use client';

import { Product, CustomerInfo } from '@/lib/types';

type CartModalProps = {
  isOpen: boolean;
  onClose: () => void;
  cart: Product[];
  removeFromCart: (idx: number) => void;
  checkoutStep: 'cart' | 'info';
  setCheckoutStep: (step: 'cart' | 'info') => void;
  customerInfo: CustomerInfo;
  setCustomerInfo: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  handleCheckout: (e: React.FormEvent) => void;
  isOrdering: boolean;
  handleLinkHover: (t: boolean) => void;
};

export default function CartModal({
  isOpen,
  onClose,
  cart,
  removeFromCart,
  checkoutStep,
  setCheckoutStep,
  customerInfo,
  setCustomerInfo,
  handleCheckout,
  isOrdering,
  handleLinkHover
}: CartModalProps) {
  const total = cart.reduce((acc, p) => acc + p.price, 0);

  if (!isOpen) return null;

  return (
    <div className={`artisan-modal-overlay open`} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="artisan-modal">
        <div className="artisan-modal-header">
          <button 
            className="btn-close" 
            onClick={onClose} 
            onMouseEnter={() => handleLinkHover(true)} 
            onMouseLeave={() => handleLinkHover(false)}
          >✕</button>
          <h1 className="display-lg">{checkoutStep === 'cart' ? 'سلة المشتريات' : 'إتمام الطلب'}</h1>
          <span className="label-sm">{checkoutStep === 'cart' ? 'الخطوة الأولى' : 'بيانات الشحن'}</span>
        </div>
        
        <div className="artisan-modal-body">
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div className="display-lg" style={{ opacity: 0.2, marginBottom: '1rem' }}>فارغة</div>
              <p className="body-lg">سلتك الخالية بانتظار لمستك الفنية ✦</p>
            </div>
          ) : checkoutStep === 'cart' ? (
            cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="artisan-cart-item">
                <img 
                  src={item.image_url || '/placeholder.svg'} 
                  alt={item.name} 
                  className="artisan-cart-img"
                />
                <div className="artisan-cart-info">
                  <div className="label-sm artisan-chip">{item.category === 'custom' ? 'طلب خاص' : (item.category || 'منتج')}</div>
                  <h3 className="body-lg" style={{ fontWeight: 700 }}>{item.name}</h3>
                  <div className="artisan-cart-meta">
                    <span className="body-lg" style={{ fontWeight: 700, color: 'var(--sys-primary)' }}>
                      {item.price > 0 ? `${item.price} ج.م` : 'يحدد لاحقاً'}
                    </span>
                    <button 
                      className="btn-tertiary-artisan" 
                      onClick={() => removeFromCart(index)} 
                      onMouseEnter={() => handleLinkHover(true)} 
                      onMouseLeave={() => handleLinkHover(false)}
                    >
                      إزالة
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <form id="checkoutForm" onSubmit={handleCheckout} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="input-group">
                <label className="label-sm" htmlFor="customerName">الاسم بالكامل</label>
                <input 
                  id="customerName"
                  type="text" 
                  placeholder="اكتب اسمك هنا..." 
                  className="artisan-input"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div className="input-group">
                <label className="label-sm" htmlFor="customerPhone">رقم الهاتف</label>
                <input 
                  id="customerPhone"
                  type="tel" 
                  placeholder="01xxxxxxxxx" 
                  className="artisan-input"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                  required
                />
              </div>
              <div className="input-group">
                <label className="label-sm" htmlFor="customerAddress">عنوان التوصيل</label>
                <textarea 
                  id="customerAddress"
                  placeholder="المحافظة، المنطقة، اسم الشارع..." 
                  className="artisan-input"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  required
                />
              </div>
            </form>
          )}
        </div>
        
        <div className="artisan-modal-footer">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
            <span className="body-lg">الإجمالي تقديرياً</span>
            <span className="display-lg" style={{ fontSize: '2rem' }}>{total} ج.م</span>
          </div>
          {checkoutStep === 'cart' ? (
            <button 
              className="btn-primary-artisan" 
              onClick={() => { if (cart.length > 0) setCheckoutStep('info'); }}
              onMouseEnter={() => handleLinkHover(true)} 
              onMouseLeave={() => handleLinkHover(false)}
              disabled={cart.length === 0}
            >
              <span>الاستمرار لبيانات الشحن</span>
              <span>←</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                type="button"
                className="btn-tertiary-artisan" 
                onClick={() => setCheckoutStep('cart')}
                onMouseEnter={() => handleLinkHover(true)} 
                onMouseLeave={() => handleLinkHover(false)}
              >
                رجوع للسلة
              </button>
              <button 
                type="submit"
                form="checkoutForm"
                className="btn-primary-artisan" 
                disabled={isOrdering}
                style={{ flex: 2 }}
              >
                <span>{isOrdering ? 'جاري التحويل...' : 'تأكيد الطلب عبر واتساب'}</span>
                <span>✦</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
