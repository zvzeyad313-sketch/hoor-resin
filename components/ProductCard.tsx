'use client';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
};

export default function ProductCard({ 
  product, 
  addToCart, 
  handleLinkHover,
  onShowDetails 
}: { 
  product: Product, 
  addToCart: (p: Product) => void, 
  handleLinkHover: (t: boolean) => void,
  onShowDetails: (p: Product) => void
}) {
  return (
    <div className="product-card fade-up">
      <div 
        className="product-img" 
        onClick={() => onShowDetails(product)}
        onMouseEnter={() => handleLinkHover(true)} 
        onMouseLeave={() => handleLinkHover(false)}
      >
        <img 
          src={product.image_url || '/placeholder.svg'} 
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        
        <div className="product-overlay-actions">
          <button 
            className="btn-primary" 
            onClick={(e) => { e.stopPropagation(); onShowDetails(product); }}
            style={{ padding: '12px 24px', fontSize: '0.9rem' }}
          >
            عرض التفاصيل ✧
          </button>
          <button 
            className="btn-secondary" 
            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
            style={{ padding: '12px 24px', fontSize: '0.9rem', background: 'rgba(255,255,255,0.9)', border: 'none', color: 'var(--ink)' }}
          >
            اطلب الآن عبر واتساب
          </button>
        </div>

        {product.category === 'sale' && <span className="product-badge badge-sale">عرض</span>}
        {product.category === 'new' && <span className="product-badge badge-new">فريد</span>}
      </div>

      <div className="product-info">
        <div className="product-cat">{product.category || 'مجموعة الفن'}</div>
        <h3 
          className="product-name" 
          onClick={() => onShowDetails(product)}
          onMouseEnter={() => handleLinkHover(true)} 
          onMouseLeave={() => handleLinkHover(false)}
          style={{ cursor: 'pointer' }}
        >
          {product.name}
        </h3>
        <div className="product-price">
          <span className="currency">ج.م </span>
          {product.price}
        </div>
      </div>
    </div>
  );
}

