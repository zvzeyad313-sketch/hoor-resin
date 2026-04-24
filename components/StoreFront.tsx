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
  const [toastVisible, setToastVisible] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const isOrderingRef = useRef(false);
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
    setCart(cart.filter((_, idx) => idx !== indexToRemove));
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
    setCursorVisibility(!isCartOpen);
  }, [isCartOpen]);

  const addToCart = (product: Product) => {
    setCart([...cart, product]);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const handleCheckout = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOrderingRef.current) return;
    if (cart.length === 0) {
      alert('السلة فارغة!');
      return;
    }
    
    isOrderingRef.current = true;
    setIsOrdering(true);
    try {
      // 1. Log to database via Next.js API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart, total: cart.reduce((acc, p) => acc + p.price, 0) })
      });
      
      if (!res.ok) throw new Error('Failed to log order');
      
      // 2. Redirect to WhatsApp
      const itemsText = cart.map(item => `- ${item.name} (${item.price} ج.م)`).join('%0A');
      const total = cart.reduce((acc, p) => acc + p.price, 0);
      const message = `مرحباً، أود طلب هذه المنتجات:%0A${itemsText}%0A%0Aالإجمالي: ${total} ج.م`;
      const waNumber = '201128025204'; // Actual WhatsApp number
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
            <h1 className="display-lg">سلة المشتريات</h1>
            <span className="label-sm">الخطوة الأخيرة</span>
          </div>
          
          <div className="artisan-modal-body">
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div className="display-lg" style={{ opacity: 0.2, marginBottom: '1rem' }}>فارغة</div>
                <p className="body-lg">سلتك الخالية بانتظار لمستك الفنية ✦</p>
              </div>
            ) : (
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
            )}
          </div>
          
          <div className="artisan-modal-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
              <span className="body-lg">الإجمالي تقديرياً</span>
              <span className="display-lg" style={{ fontSize: '2rem' }}>{cart.reduce((acc, p) => acc + p.price, 0)} ج.م</span>
            </div>
            <button 
              className="btn-primary-artisan" 
              onClick={(e) => {
                if (cart.length > 0 && !isOrdering) {
                  setIsCartOpen(false);
                  handleCheckout(e);
                }
              }}
              onMouseEnter={() => handleLinkHover(true)} 
              onMouseLeave={() => handleLinkHover(false)}
              disabled={cart.length === 0 || isOrdering}
              style={{ opacity: (cart.length === 0 || isOrdering) ? 0.6 : 1 }}
            >
              <span style={{ fontFamily: 'Tajawal, sans-serif' }}>{isOrdering ? 'جاري التحويل...' : 'إتمام الطلب عبر واتساب'}</span>
              <span>✦</span>
            </button>
          </div>
        </div>
      </div>
      
      <Hero handleLinkHover={handleLinkHover} />

      {/* MARQUEE */}
      <div className="marquee-section">
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
          <div className="section-label">✦ أحدث القطع</div>
          <h2 className="section-title">منتجاتنا <em>المميزة</em></h2>
        </div>

        <div className="products-grid">
          {initialProducts.length > 0 ? (
            initialProducts.map((p, i) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                addToCart={addToCart} 
                handleLinkHover={handleLinkHover} 
              />
            ))
          ) : (
             <div style={{ textAlign: 'center', width: '100%', gridColumn: '1/-1', color: 'var(--text-light)' }}>لا توجد منتجات حالياً. سيتم إضافتها قريباً! ✨</div>
          )}
        </div>
      </section>

      {/* CUSTOM ORDER */}
      <section className="custom-section fade-up" id="custom">
        <div className="custom-text" style={{ position: 'relative', zIndex: 1 }}>
          <div className="custom-label">✦ خدمة مميزة</div>
          <h2 className="custom-title">نصنعلك <em>حلمك</em><br/>بأيدينا 💕</h2>
          <p className="custom-desc">
            عايزة قطعة خاصة بيكِ؟ مكتوب عليها اسمك أو تاريخ مميز؟
            احنا هنا عشان نحوّل كل فكرة في دماغك لقطعة رزن تحفة ✨
          </p>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
               onClick={(e) => {
                 e.preventDefault();
                 if(!customOrder.colorShape && !customOrder.nameMessage && !customOrder.details) {
                   alert("يرجى إدخال بعض تفاصيل الطلب الخاص أولاً!");
                   return;
                 }
                 const product: Product = {
                   id: 'custom-' + Date.now(),
                   name: 'طلب خاص (Custom Order)',
                   description: `اللون والشكل: ${customOrder.colorShape || 'غير محدد'} | الاسم/الرسالة: ${customOrder.nameMessage || 'بدون'} | الجليتر: ${customOrder.glitterType || 'بدون'} | الحجم: ${customOrder.size} | التفاصيل: ${customOrder.details || 'لا يوجد'}`,
                   price: 0, 
                   category: 'custom',
                   image_url: '/placeholder.svg' 
                 };
                 addToCart(product);
                 setCustomOrder({ colorShape: '', nameMessage: '', details: '', deliveryNotes: '', glitterType: '', size: 'medium' });
               }}
               className="btn-light" 
               onMouseEnter={() => handleLinkHover(true)} 
               onMouseLeave={() => handleLinkHover(false)}
            >
              إضافة الطلب الخاص للسلة 🛒
            </button>
            <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>* السعر يتحدد بناءً على التفاصيل بعد التواصل</p>
          </div>
        </div>
        <div className="custom-visual">
          <div className="custom-grid-inputs">
            <div className="custom-item">
              <div className="icon">🎨</div>
              <label>الألوان والشكل</label>
              <input 
                type="text" 
                className="custom-input" 
                placeholder="مثال: أمواج زرقاء، ورد مجفف..."
                value={customOrder.colorShape}
                onChange={(e) => setCustomOrder(prev => ({ ...prev, colorShape: e.target.value }))}
              />
            </div>
            <div className="custom-item">
              <div className="icon">✍️</div>
              <label>الاسم أو الرسالة</label>
              <input 
                type="text" 
                className="custom-input" 
                placeholder="الاسم المراد كتابته..."
                value={customOrder.nameMessage}
                onChange={(e) => setCustomOrder(prev => ({ ...prev, nameMessage: e.target.value }))}
              />
            </div>
            <div className="custom-item">
              <div className="icon">✨</div>
              <label>نوع الجليتر / الإضافات</label>
              <input 
                type="text" 
                className="custom-input" 
                placeholder="ذهبي، فضي، نجوم..."
                value={customOrder.glitterType}
                onChange={(e) => setCustomOrder(prev => ({ ...prev, glitterType: e.target.value }))}
              />
            </div>
            <div className="custom-item">
              <div className="icon">📏</div>
              <label>الحجم المطلوب</label>
              <select 
                className="custom-input"
                value={customOrder.size}
                onChange={(e) => setCustomOrder(prev => ({ ...prev, size: e.target.value }))}
                style={{ appearance: 'none' }}
              >
                <option value="small">صغير (S)</option>
                <option value="medium">متوسط (M)</option>
                <option value="large">كبير (L)</option>
              </select>
            </div>
            <div className="custom-item full-width">
              <div className="icon">🌸</div>
              <label>تفاصيل إضافية</label>
              <textarea 
                className="custom-input custom-textarea" 
                placeholder="صفي لنا ما بداخل مخيلتك لنجعله حقيقة..."
                value={customOrder.details}
                onChange={(e) => setCustomOrder(prev => ({ ...prev, details: e.target.value }))}
                rows={3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="why fade-up" id="about">
        <div className="section-header">
          <div className="section-label">✦ ليه Hoor</div>
          <h2 className="section-title">لأننا <em>نهتم</em> بكل تفصيلة</h2>
        </div>
        <div className="why-grid">
          <div className="why-card">
            <span className="why-icon">🤲</span>
            <div className="why-title">صنع يدوي 100%</div>
            <p className="why-desc">كل قطعة تتصنع بإيدينا بكل حب واهتمام، مفيش قطعتين زي بعض أبداً</p>
          </div>
          <div className="why-card">
            <span className="why-icon">🌿</span>
            <div className="why-title">خامات عالية الجودة</div>
            <p className="why-desc">بنستخدم رزن وألوان عالمية آمنة وتدوم لسنين طويلة</p>
          </div>
          <div className="why-card">
            <span className="why-icon">💝</span>
            <div className="why-title">تغليف مميز</div>
            <p className="why-desc">كل طلب بيتغلف بعناية في علبة هدية جميلة، مناسب للهدايا الخاصة</p>
          </div>
          <div className="why-card">
            <span className="why-icon">🚚</span>
            <div className="why-title">توصيل لكل مكان</div>
            <p className="why-desc">بنوصّل لكل محافظات مصر، والشحن متاح لجميع الأماكن</p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials fade-up">
        <div className="section-header">
          <div className="section-label">✦ آراء عملاؤنا</div>
          <h2 className="section-title">بيقولوا عنا <em>إيه؟</em></h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">⭐⭐⭐⭐⭐</div>
            <p className="testimonial-text">ربنا يبارك في الأيادي اللي صنعت الخاتم ده! جميل جداً وفاق توقعاتي بمراحل 😍 الشحن كان سريع والتغليف تحفة</p>
            <div className="testimonial-author">
              <div className="avatar av-1">👩</div>
              <div>
                <div className="author-name">سارة محمد</div>
                <div className="author-loc">📍 القاهرة</div>
              </div>
            </div>
          </div>
          {/* Add more testimonials here or map them if needed */}
        </div>
      </section>

      <Footer />
    </>
  );
}
