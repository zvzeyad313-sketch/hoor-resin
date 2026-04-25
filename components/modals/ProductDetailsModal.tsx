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
            aria-label="Close"
          >✕</button>
          <div className="badge-limited">🔥 Limited Edition - Unique Piece</div>
        </div>
        
        <div className="artisan-modal-body">
          <div className="product-details-container">
            {/* LEFT: IMAGE GALLERY */}
            <div className="product-gallery">
              <div className="gallery-main">
                <img 
                  src={product.image_url || '/placeholder.svg'} 
                  alt={product.name} 
                />
              </div>
              <div className="gallery-thumbs">
                <img src={product.image_url || '/placeholder.svg'} alt="Thumb 1" className="active" />
                {/* Placeholders for additional views if available */}
                <div className="thumb-placeholder">✨</div>
                <div className="thumb-placeholder">🎨</div>
              </div>
            </div>

            {/* RIGHT: INFO & ACTIONS */}
            <div className="product-main-info">
              <h1 className="display-lg" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{product.name}</h1>
              <div className="label-sm" style={{ color: 'var(--gold)', marginBottom: '1.5rem' }}>{product.category || 'Premium Resin Art'}</div>
              
              <div className="product-price-large">
                <span className="amount">{product.price}</span>
                <span className="currency"> ج.م</span>
              </div>

              <div className="product-sections">
                <div className="info-section">
                  <h3>قصة المنتج (Product Story)</h3>
                  <p>{product.description || 'قطعة فنية فريدة صممت خصيصاً لتجمع بين جمال الطبيعة ورقّي فن الرزن.'}</p>
                </div>

                <div className="info-section">
                  <h3>المميزات (Features)</h3>
                  <ul>
                    <li>✦ صنع يدوي 100% (Handmade)</li>
                    <li>✦ تصميم فريد لا يتكرر (Unique Design)</li>
                    <li>✦ رزن عالي الجودة ومقاوم للاصفرار</li>
                  </ul>
                </div>

                <div className="info-section">
                  <h3>الاستخدام (Usage)</h3>
                  <p>مثالية للديكور المنزلي الفاخر، أو كهدية استثنائية لمن تحب.</p>
                </div>
              </div>

              <div className="product-actions-sticky">
                <button 
                  className="btn-primary-artisan" 
                  onClick={() => {
                    addToCart(product);
                    onClose();
                  }}
                  onMouseEnter={() => handleLinkHover(true)} 
                  onMouseLeave={() => handleLinkHover(false)}
                >
                  <span>أضف للسلة الآن</span>
                  <span>✦</span>
                </button>
              </div>

              {/* REVIEWS */}
              <div className="product-reviews">
                <h3>آراء العملاء</h3>
                <div className="mini-review">
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                  <p>"الجودة فاقت توقعاتي، التفاصيل مذهلة جداً!"</p>
                </div>
                <div className="mini-review">
                  <div className="stars">⭐⭐⭐⭐⭐</div>
                  <p>"تغليف رائع وقطعة فنية حقيقية."</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
