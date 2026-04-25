'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import ProductCard from './ProductCard';
import Footer from './Footer';
import { useCustomCursor } from '@/lib/hooks/useCustomCursor';

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
};

export default function StoreFront({ initialProducts }: { initialProducts: Product[] }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'info'>('cart');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [toastVisible, setToastVisible] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const isOrderingRef = useRef(false);
  
  // New States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');

  const [customOrder, setCustomOrder] = useState({
    colorShape: '',
    nameMessage: '',
    glitterType: '',
    size: 'medium',
    details: '',
    deliveryNotes: ''
  });

  const { cursorRef, ringRef, handleLinkHover, setCursorVisibility } = useCustomCursor();

  const removeFromCart = (indexToRemove: number) => {
    const newCart = cart.filter((_, idx) => idx !== indexToRemove);
    setCart(newCart);
    if (newCart.length === 0) setCheckoutStep('cart');
  };

  useEffect(() => {
    // Scroll observer
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    
    setTimeout(() => {
      document.querySelectorAll('.fade-up').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add('visible');
      });
    }, 100);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Handle cursor visibility when modal opens/closes
  useEffect(() => {
    setCursorVisibility(!isCartOpen && !selectedProduct);
    if (!isCartOpen) {
      setTimeout(() => setCheckoutStep('cart'), 400); // Reset after animation
    }
  }, [isCartOpen, selectedProduct]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const filteredProducts = initialProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['الكل', ...Array.from(new Set(initialProducts.map(p => p.category).filter(Boolean)))];

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOrderingRef.current) return;
    if (cart.length === 0) {
      alert('السلة فارغة!');
      return;
    }

    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert('يرجى إكمال بيانات الشحن أولاً!');
      return;
    }
    
    isOrderingRef.current = true;
    setIsOrdering(true);
    try {
      const total = cart.reduce((acc, p) => acc + p.price, 0);
      
      // 1. Log to database via Next.js API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          items: cart, 
          total,
          customer_name: customerInfo.name,
          customer_phone: customerInfo.phone,
          customer_address: customerInfo.address,
          notes: customerInfo.notes
        })
      });
      
      if (!res.ok) throw new Error('Failed to log order');
      
      // 2. Redirect to WhatsApp
      const itemsText = cart.map(item => `- ${item.name} (${item.price} ج.م)`).join('%0A');
      const infoText = `الاسم: ${customerInfo.name}%0Aالهاتف: ${customerInfo.phone}%0Aالعنوان: ${customerInfo.address}${customerInfo.notes ? `%0Aملاحظات: ${customerInfo.notes}` : ''}`;
      const message = `مرحباً هوور، أود طلب هذه المنتجات:%0A${itemsText}%0A%0Aإجمالي المبلغ: ${total} ج.م%0A%0Aبيانات الشحن:%0A${infoText}`;
      const waNumber = '201128025204'; 
      window.location.href = `https://wa.me/${waNumber}?text=${message}`;
      
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى.');
    } finally {
      isOrderingRef.current = false;
      setIsOrdering(false);
    }
  };

  return (
    <>
      <div className="cursor" id="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>
      <div className={`toast ${toastVisible ? 'show' : ''}`} id="toast">✨ تم إضافة المنتج للسلة!</div>

      <Navbar cartCount={cart.length} isOrdering={isOrdering} handleCheckout={(e) => { e.preventDefault(); setIsCartOpen(true); }} handleLinkHover={handleLinkHover} />
      
      {/* ARTISANAL CART MODAL */}
      <div className={`artisan-modal-overlay ${isCartOpen ? 'open' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setIsCartOpen(false);
      }}>
        <div className="artisan-modal">
          <div className="artisan-modal-header">
            <button className="btn-close" onClick={() => setIsCartOpen(false)} onMouseEnter={() => handleLinkHover(true)} onMouseLeave={() => handleLinkHover(false)}>✕</button>
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
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                  <div className="artisan-cart-info">
                    <div className="label-sm artisan-chip">{item.category === 'custom' ? 'طلب خاص' : (item.category || 'منتج')}</div>
                    <h3 className="body-lg" style={{ fontWeight: 700 }}>{item.name}</h3>
                    {item.description && (
                      <p className="body-lg" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                        {item.description.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
                      </p>
                    )}
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
                  <label className="label-sm" style={{ marginBottom: '0.5rem', display: 'block' }}>الاسم بالكامل</label>
                  <input 
                    type="text" 
                    placeholder="اكتب اسمك هنا..." 
                    className="artisan-input"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="label-sm" style={{ marginBottom: '0.5rem', display: 'block' }}>رقم الهاتف</label>
                  <input 
                    type="tel" 
                    placeholder="01xxxxxxxxx" 
                    className="artisan-input"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="label-sm" style={{ marginBottom: '0.5rem', display: 'block' }}>عنوان التوصيل</label>
                  <textarea 
                    placeholder="المحافظة، المنطقة، اسم الشارع..." 
                    className="artisan-input"
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>
                <div className="input-group">
                  <label className="label-sm" style={{ marginBottom: '0.5rem', display: 'block' }}>ملاحظات إضافية (اختياري)</label>
                  <textarea 
                    placeholder="أي تفاصيل أخرى تود إضافتها للطلب..." 
                    className="artisan-input"
                    value={customerInfo.notes}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, notes: e.target.value }))}
                    rows={2}
                  />
                </div>
              </form>
            )}
          </div>
          
          <div className="artisan-modal-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
              <span className="body-lg">الإجمالي تقديرياً</span>
              <span className="display-lg" style={{ fontSize: '2rem' }}>{cart.reduce((acc, p) => acc + p.price, 0)} ج.م</span>
            </div>
            {checkoutStep === 'cart' ? (
              <button 
                className="btn-primary-artisan" 
                onClick={() => {
                  if (cart.length > 0) setCheckoutStep('info');
                }}
                onMouseEnter={() => handleLinkHover(true)} 
                onMouseLeave={() => handleLinkHover(false)}
                disabled={cart.length === 0}
                style={{ opacity: cart.length === 0 ? 0.6 : 1 }}
              >
                <span>الاستمرار لبيانات الشحن</span>
                <span>←</span>
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  className="btn-tertiary-artisan" 
                  onClick={() => setCheckoutStep('cart')}
                  onMouseEnter={() => handleLinkHover(true)} 
                  onMouseLeave={() => handleLinkHover(false)}
                  style={{ padding: '1rem' }}
                >
                  رجوع للسلة
                </button>
                <button 
                  type="submit"
                  form="checkoutForm"
                  className="btn-primary-artisan" 
                  onMouseEnter={() => handleLinkHover(true)} 
                  onMouseLeave={() => handleLinkHover(false)}
                  disabled={isOrdering}
                  style={{ flex: 2 }}
                >
                  <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{isOrdering ? 'جاري التحويل...' : 'تأكيد الطلب عبر واتساب'}</span>
                  <span>✦</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PRODUCT DETAILS MODAL */}
      <div className={`artisan-modal-overlay ${selectedProduct ? 'open' : ''}`} onClick={(e) => {
        if (e.target === e.currentTarget) setSelectedProduct(null);
      }}>
        <div className="artisan-modal product-details-modal">
          <div className="artisan-modal-header">
            <button className="btn-close" onClick={() => setSelectedProduct(null)} onMouseEnter={() => handleLinkHover(true)} onMouseLeave={() => handleLinkHover(false)}>✕</button>
            <h1 className="display-lg">تفاصيل المنتج</h1>
            <span className="label-sm">{selectedProduct?.category || 'منتج'}</span>
          </div>
          
          <div className="artisan-modal-body">
            {selectedProduct && (
              <div className="product-details-content">
                <div className="product-details-img">
                  <img 
                    src={selectedProduct.image_url || '/placeholder.svg'} 
                    alt={selectedProduct.name} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                </div>
                <div className="product-details-info">
                  <h2 className="display-lg" style={{ marginBottom: '1rem' }}>{selectedProduct.name}</h2>
                  <div className="product-price" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>
                    <span className="currency">ج.م </span>{selectedProduct.price}
                  </div>
                  <p className="body-lg" style={{ marginBottom: '2rem', lineHeight: '1.8' }}>
                    {selectedProduct.description || 'لا يوجد وصف متاح لهذا المنتج حالياً.'}
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
            )}
          </div>
          
          <div className="artisan-modal-footer">
            <button 
              className="btn-primary-artisan" 
              onClick={() => {
                if (selectedProduct) {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }
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
      
      <Hero handleLinkHover={handleLinkHover} />

      <main>
        {/* MARQUEE */}
        <div className="marquee-section" aria-hidden="true">
          <div className="marquee-track">
            <span>رزن يدوي</span><span className="dot">✦</span>
            <span>مجوهرات فريدة</span><span className="dot">✦</span>
            <span>إكسسوارات مخصصة</span><span className="dot">✦</span>
            <span>هدايا مميزة</span><span className="dot">✦</span>
            <span>صنع بحب</span><span className="dot">✦</span>
            <span>Hoor Resin Art</span><span className="dot">✦</span>
            <span>رزن يدوي</span><span className="dot">✦</span>
            <span>مجوهرات فريدة</span><span className="dot">✦</span>
            <span>إكسسوارات مخصصة</span><span className="dot">✦</span>
            <span>هدايا مميزة</span><span className="dot">✦</span>
            <span>صنع بحب</span><span className="dot">✦</span>
            <span>Hoor Resin Art</span><span className="dot">✦</span>
          </div>
        </div>

        {/* FEATURED PRODUCTS */}
        <section className="featured" id="featured">
          <div className="section-header fade-up">
            <span className="section-label">✦ أحدث القطع</span>
            <h2 className="section-title">منتجاتنا <em>المميزة</em></h2>
          </div>

          {/* Search & Filter Bar */}
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
              filteredProducts.map((p, i) => (
                <ProductCard 
                  key={p.id} 
                  product={p} 
                  addToCart={addToCart} 
                  handleLinkHover={handleLinkHover} 
                  onShowDetails={setSelectedProduct}
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

        {/* CUSTOM ORDER / STUDIO */}
        <section className="studio-section fade-up" id="custom">
          <div className="studio-container">
            <div className="studio-content">
              <span className="section-label">✦ استوديو التصميم اليدوي</span>
              <h2 className="display-lg" style={{ marginBottom: '1.5rem' }}>صممي <em>قطعتك الفريدة</em> بنفسك</h2>
              <p className="body-lg" style={{ marginBottom: '3rem', maxWidth: '500px', opacity: 0.8 }}>
                سواء كنتِ تبحثين عن هدية لمناسبة خاصة أو تريدين قطعة فنية تعبر عن ذوقك، نحن هنا لنحول خيالك إلى واقع ملموس بدقة واحترافية.
              </p>

              <div className="studio-process">
                <div className="process-step">
                  <div className="step-badge" aria-hidden="true">01</div>
                  <div className="step-info">
                    <h3>اختيار التصميم</h3>
                    <p>حددي الألوان، الأشكال، والإضافات التي تفضلينها (ورد، ورق ذهب، صور).</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-badge" aria-hidden="true">02</div>
                  <div className="step-info">
                    <h3>التنفيذ اليدوي</h3>
                    <p>نبدأ بصب الرزن يدوياً مع العناية بأدق التفاصيل لضمان أعلى جودة.</p>
                  </div>
                </div>
                <div className="process-step">
                  <div className="step-badge" aria-hidden="true">03</div>
                  <div className="step-info">
                    <h3>التغليف الفاخر</h3>
                    <p>نغلف طلبك بعناية فائقة ليصلك كقطعة فنية تليق بكِ.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="studio-form-wrapper">
              <div className="studio-card-glass">
                <h3 className="body-lg" style={{ fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>تفاصيل طلبك الخاص</h3>
                <div className="studio-grid">
                  <div className="input-group">
                    <label className="label-sm" htmlFor="colorShape">الألوان والشكل</label>
                    <input 
                      id="colorShape"
                      type="text" 
                      placeholder="مثال: أمواج زرقاء، ورد مجفف..." 
                      className="artisan-input"
                      value={customOrder.colorShape}
                      onChange={(e) => setCustomOrder(prev => ({ ...prev, colorShape: e.target.value }))}
                    />
                  </div>
                  <div className="input-group">
                    <label className="label-sm" htmlFor="nameMessage">الاسم أو العبارة</label>
                    <input 
                      id="nameMessage"
                      type="text" 
                      placeholder="الاسم المراد كتابته" 
                      className="artisan-input"
                      value={customOrder.nameMessage}
                      onChange={(e) => setCustomOrder(prev => ({ ...prev, nameMessage: e.target.value }))}
                    />
                  </div>
                  <div className="input-group">
                    <label className="label-sm" htmlFor="glitterType">نوع الجليتر / الإضافات</label>
                    <input 
                      id="glitterType"
                      type="text" 
                      placeholder="ذهبي، فضي، نجوم..." 
                      className="artisan-input"
                      value={customOrder.glitterType}
                      onChange={(e) => setCustomOrder(prev => ({ ...prev, glitterType: e.target.value }))}
                    />
                  </div>
                  <div className="input-group">
                    <label className="label-sm" htmlFor="size">الحجم المطلوب</label>
                    <select 
                      id="size"
                      className="artisan-input"
                      value={customOrder.size}
                      onChange={(e) => setCustomOrder(prev => ({ ...prev, size: e.target.value }))}
                    >
                      <option value="small">صغير (S)</option>
                      <option value="medium">متوسط (M)</option>
                      <option value="large">كبير (L)</option>
                    </select>
                  </div>
                  <div className="input-group full-width">
                    <label className="label-sm" htmlFor="details">تفاصيل إضافية</label>
                    <textarea 
                      id="details"
                      placeholder="صفي لنا ما بداخل مخيلتك لنجعله حقيقة..." 
                      className="artisan-input"
                      rows={3}
                      value={customOrder.details}
                      onChange={(e) => setCustomOrder(prev => ({ ...prev, details: e.target.value }))}
                    />
                  </div>
                  <button 
                    className="btn-primary-artisan"
                    onClick={(e) => {
                      e.preventDefault();
                      if(!customOrder.colorShape && !customOrder.nameMessage && !customOrder.details) {
                        alert("يرجى إدخال بعض تفاصيل الطلب الخاص أولاً!");
                        return;
                      }
                      const product: Product = {
                        id: 'custom-' + Date.now(),
                        name: 'طلب خاص: ' + (customOrder.colorShape || 'تصميم يدوي'),
                        description: `اللون: ${customOrder.colorShape} | الاسم: ${customOrder.nameMessage} | الجليتر: ${customOrder.glitterType} | الحجم: ${customOrder.size} | التفاصيل: ${customOrder.details}`,
                        price: 0,
                        category: 'custom',
                        image_url: '/placeholder.svg'
                      };
                      addToCart(product);
                      setCheckoutStep('info');
                      setIsCartOpen(true);
                    }}
                    onMouseEnter={() => handleLinkHover(true)} 
                    onMouseLeave={() => handleLinkHover(false)}
                  >
                    <span>متابعة الطلب الخاص</span>
                    <span>✦</span>
                  </button>
                </div>
                <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.6, marginTop: '1.5rem' }}>* سيتم تحديد التكلفة النهائية بعد مراجعة التفاصيل</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="why fade-up" id="about">
          <div className="section-header">
            <span className="section-label">✦ ليه Hoor</span>
            <h2 className="section-title">لأننا <em>نهتم</em> بكل تفصيلة</h2>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <span className="why-icon" aria-hidden="true">🤲</span>
              <h3 className="why-title">صنع يدوي 100%</h3>
              <p className="why-desc">كل قطعة تتصنع بإيدينا بكل حب واهتمام، مفيش قطعتين زي بعض أبداً</p>
            </div>
            <div className="why-card">
              <span className="why-icon" aria-hidden="true">🌿</span>
              <h3 className="why-title">خامات عالية الجودة</h3>
              <p className="why-desc">بنستخدم رزن وألوان عالمية آمنة وتدوم لسنين طويلة</p>
            </div>
            <div className="why-card">
              <span className="why-icon" aria-hidden="true">💝</span>
              <h3 className="why-title">تغليف مميز</h3>
              <p className="why-desc">كل طلب بيتغلف بعناية في علبة هدية جميلة، مناسب للهدايا الخاصة</p>
            </div>
            <div className="why-card">
              <span className="why-icon" aria-hidden="true">🚚</span>
              <h3 className="why-title">توصيل لكل مكان</h3>
              <p className="why-desc">بنوصّل لكل محافظات مصر، والشحن متاح لجميع الأماكن</p>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testimonials fade-up">
          <div className="section-header">
            <span className="section-label">✦ آراء عملاؤنا</span>
            <h2 className="section-title">بيقولوا عنا <em>إيه؟</em></h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars" aria-label="5 stars">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">ربنا يبارك في الأيادي اللي صنعت الخاتم ده! جميل جداً وفاق توقعاتي بمراحل 😍 الشحن كان سريع والتغليف تحفة</p>
              <div className="testimonial-author">
                <div className="avatar av-1" aria-hidden="true">👩</div>
                <div>
                  <div className="author-name">سارة محمد</div>
                  <div className="author-loc">📍 القاهرة</div>
                </div>
              </div>
            </div>
            {/* Add more testimonials here or map them if needed */}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
