'use client';

import { Product } from '@/lib/types';
import ProductCard from '../ProductCard';

type FeaturedProductsProps = {
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  addToCart: (p: Product) => void;
  onShowDetails: (p: Product) => void;
  handleLinkHover: (t: boolean) => void;
};

export default function FeaturedProducts({
  filteredProducts,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  addToCart,
  onShowDetails,
  handleLinkHover
}: FeaturedProductsProps) {
  return (
    <section className="featured" id="featured">
      <div className="section-header fade-up">
        <span className="section-label">✦ أحدث القطع</span>
        <h2 className="section-title">منتجاتنا <em>المميزة</em></h2>
      </div>

      <div className="filter-bar fade-up">
        <div className="search-wrapper">
          <input 
            type="text" 
            placeholder="ابحث عن قطعة فنية..." 
            aria-label="ابحث عن منتج"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onMouseEnter={() => handleLinkHover(true)} 
            onMouseLeave={() => handleLinkHover(false)}
          />
          <span className="search-icon" aria-hidden="true">🔍</span>
        </div>
        <div className="category-filters" role="group" aria-label="تصفية حسب التصنيف">
          {categories.map(cat => (
            <button 
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
              onMouseEnter={() => handleLinkHover(true)} 
              onMouseLeave={() => handleLinkHover(false)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              addToCart={addToCart} 
              handleLinkHover={handleLinkHover} 
              onShowDetails={onShowDetails}
            />
          ))
        ) : (
           <div style={{ textAlign: 'center', width: '100%', gridColumn: '1/-1', color: 'var(--text-light)', padding: '4rem 0' }}>
             <div style={{ fontSize: '3rem', marginBottom: '1rem' }} aria-hidden="true">✨</div>
             <p className="body-lg">لم نجد أي قطع تطابق بحثك حالياً.</p>
             <button 
               className="btn-tertiary-artisan" 
               onClick={() => { setSearchQuery(''); setSelectedCategory('الكل'); }}
               style={{ marginTop: '1rem' }}
             >
               عرض كل المنتجات
             </button>
           </div>
        )}
      </div>
    </section>
  );
}
