'use client';

import { Product } from '@/lib/types';

type ProductDetailsModalProps = {
  product: Product | null;
  onClose: () => void;
  addToCart: (p: Product) => void;
  handleLinkHover: (t: boolean) => void;
};

export default function ProductDetailsModal({
  product,
  onClose,
  addToCart,
  handleLinkHover
}: ProductDetailsModalProps) {
  if (!product) return null;

  return (
    <div className="artisan-modal-overlay open" onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="artisan-modal product-details-modal">
        <div className="artisan-modal-header">
          <button 
            className="btn-close" 
            onClick={onClose} 
            onMouseEnter={() => handleLinkHover(true)} 
            onMouseLeave={() => handleLinkHover(false)}
          >✕</button>
          <h1 className="display-lg">تفاصيل المنتج</h1>
          <span className="label-sm">{product.category || 'منتج'}</span>
        </div>
        
        <div className="artisan-modal-body">
          <div className="product-details-content">
            <div className="product-details-img">
              <img 
                src={product.image_url || '/placeholder.svg'} 
                alt={product.name} 
              />
            </div>
            <div className="product-details-info">
              <h2 className="display-lg" style={{ marginBottom: '1rem' }}>{product.name}</h2>
              <div className="product-price" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                <span className="currency">ج.م </span>{product.price}
              </div>
              <p className="body-lg" style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
                {product.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}
              </p>
              
              <div className="product-details-features">
                <div className="feature-item">
                  <span>✦</span> صنع يدوياً بكل حب
                </div>
                <div className="feature-item">
                  <span>✦</span> خامات عالية الجودة
                </div>
                <div className="feature-item">
                  <span>✦</span> قطعة فريدة من نوعها
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="artisan-modal-footer">
          <button 
            className="btn-primary-artisan" 
            onClick={() => {
              addToCart(product);
              onClose();
            }}
            onMouseEnter={() => handleLinkHover(true)} 
            onMouseLeave={() => handleLinkHover(false)}
          >
            <span>إضافة للسلة</span>
            <span>✦</span>
          </button>
        </div>
      </div>
    </div>
  );
}
