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
        style={{ cursor: 'pointer' }} 
        onClick={() => onShowDetails(product)}
        onMouseEnter={() => handleLinkHover(true)} 
        onMouseLeave={() => handleLinkHover(false)}
      >
        <img 
          src={product.image_url || '/placeholder.svg'} 
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        {product.category === 'sale' && <span className="product-badge badge-sale">خصم</span>}
        {product.category === 'new' && <span className="product-badge badge-new">جديد</span>}
      </div>
      <div className="product-info">
        <div className="product-cat">{product.category || 'منتجات'}</div>
        <div 
          className="product-name" 
          style={{ cursor: 'pointer' }}
          onClick={() => onShowDetails(product)}
          onMouseEnter={() => handleLinkHover(true)} 
          onMouseLeave={() => handleLinkHover(false)}
        >{product.name}</div>
        <div className="product-desc">{product.description}</div>
        <div className="product-bottom">
          <div className="product-price"><span className="currency">ج.م </span>{product.price}</div>
          <button className="btn-add" onClick={() => addToCart(product)} onMouseEnter={() => handleLinkHover(true)} onMouseLeave={() => handleLinkHover(false)}>أضف للسلة +</button>
        </div>
      </div>
    </div>
  );
}
