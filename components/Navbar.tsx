'use client';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
};

export default function Navbar({ cartCount, isOrdering, handleCheckout, handleLinkHover }: { cartCount: number, isOrdering: boolean, handleCheckout: (e: React.MouseEvent) => void, handleLinkHover: (t: boolean) => void }) {
  return (
    <header>
      <nav>
        <a href="#" className="logo" onMouseEnter={() => handleLinkHover(true)} onMouseLeave={() => handleLinkHover(false)}>HOOR <span>✦</span> Art</a>
        <ul className="nav-links">
          <li><a href="#featured" onMouseEnter={() => handleLinkHover(true)} onMouseLeave={() => handleLinkHover(false)}>المنتجات</a></li>
          <li><a href="#custom" onMouseEnter={() => handleLinkHover(true)} onMouseLeave={() => handleLinkHover(false)}>طلبات خاصة</a></li>
          <li><a href="#about" onMouseEnter={() => handleLinkHover(true)} onMouseLeave={() => handleLinkHover(false)}>من نحن</a></li>
          <li><a href="#contact" onMouseEnter={() => handleLinkHover(true)} onMouseLeave={() => handleLinkHover(false)}>تواصل معنا</a></li>
        </ul>
        <a href="#" className="nav-cart" onClick={handleCheckout} onMouseEnter={() => handleLinkHover(true)} onMouseLeave={() => handleLinkHover(false)}>
          {isOrdering ? 'جاري التحويل...' : '🛒 السلة'}
          <span id="cart-count" style={{ background: 'var(--rose)', padding: '2px 8px', borderRadius: '50px', fontSize: '0.75rem', marginRight: '5px' }}>
            {cartCount}
          </span>
        </a>
      </nav>
    </header>
  );
}
