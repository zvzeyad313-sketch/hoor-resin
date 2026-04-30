'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Footer from './Footer';
import CartModal from './modals/CartModal';
import ProductDetailsModal from './modals/ProductDetailsModal';
import OrderTrackingModal from './modals/OrderTrackingModal';
import FeaturedProducts from './sections/FeaturedProducts';
import Craftsmanship from './sections/Craftsmanship';
import StudioSection from './studio/StudioSection';
import WhyUs from './sections/WhyUs';
import Testimonials from './sections/Testimonials';
import { useCustomCursor } from '@/lib/hooks/useCustomCursor';
import { Product, CustomerInfo, CustomOrder } from '@/lib/types';

export default function StoreFront({ initialProducts }: { initialProducts: Product[] }) {
  // --- STATE ---
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'info'>('cart');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    phone: '',
    address: '',
    notes: ''
  });
  const [customOrder, setCustomOrder] = useState<CustomOrder>({
    colorShape: '',
    nameMessage: '',
    glitterType: '',
    size: 'medium',
    details: ''
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const [toastVisible, setToastVisible] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);
  const [isTrackOpen, setIsTrackOpen] = useState(false);

  // --- REFS & HOOKS ---
  const isOrderingRef = useRef(false);

  const { cursorRef, ringRef, handleLinkHover, setCursorVisibility } = useCustomCursor();

  // --- EFFECTS ---
  useEffect(() => {
    // Scroll observer for fade-up animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
    
    // Initial check for elements already in view
    setTimeout(() => {
      document.querySelectorAll('.fade-up').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) el.classList.add('visible');
      });
    }, 100);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setCursorVisibility(!isCartOpen && !selectedProduct);
    if (!isCartOpen) {
      setTimeout(() => setCheckoutStep('cart'), 400); 
    }
  }, [isCartOpen, selectedProduct, setCursorVisibility]);

  // --- HANDLERS ---
  const addToCart = (product: Product) => {
    setCart(prev => [...prev, product]);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2500);
  };

  const removeFromCart = (indexToRemove: number) => {
    setCart(prev => {
      const newCart = prev.filter((_, idx) => idx !== indexToRemove);
      if (newCart.length === 0) setCheckoutStep('cart');
      return newCart;
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOrderingRef.current) return;
    if (cart.length === 0) return alert('السلة فارغة!');
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      return alert('يرجى إكمال بيانات الشحن أولاً!');
    }
    
    isOrderingRef.current = true;
    setIsOrdering(true);
    try {
      const total = cart.reduce((acc, p) => acc + p.price, 0);
      
      // 1. Save order to database for tracking
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
      
      const resData = await res.json();
      
      if (!res.ok) {
        console.error('API Error:', resData.error);
        // We still proceed to WhatsApp even if DB logging fails, to ensure the sale isn't lost
        // but we'll show a warning in console
      }

      const orderId = resData.data?.[0]?.id || 'NEW-' + Date.now().toString().slice(-6);
      
      // 2. Prepare WhatsApp message
      const waNumber = '201207147650'; 
      let message = `*طلب جديد من متجر HOOR ✦*\n\n`;
      message += `*رقم الطلب:* #${orderId.substring(0, 8)}\n`;
      message += `*العميل:* ${customerInfo.name}\n`;
      message += `*الهاتف:* ${customerInfo.phone}\n`;
      message += `*العنوان:* ${customerInfo.address}\n`;
      if (customerInfo.notes) message += `*ملاحظات:* ${customerInfo.notes}\n`;
      
      message += `\n*المنتجات:*\n`;
      cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - ${item.price > 0 ? `${item.price} ج.م` : 'يحدد السعر لاحقاً'}\n`;
      });
      
      message += `\n*الإجمالي التقديري:* ${total} ج.م\n\n`;
      message += `شكراً لاختياركم HOOR Art ✨`;

      // 3. Inform user and redirect
      alert(`تم تجهيز طلبك بنجاح! رقم الطلب: #${orderId.substring(0, 8)}\n\nسيتم الآن تحويلك إلى واتساب لإتمام الطلب مع فريقنا.`);
      
      window.location.href = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
      
      // Clear cart after success
      setCart([]);
      setIsCartOpen(false);
      setCheckoutStep('cart');
    } catch (err) {
      console.error('Checkout error:', err);
      alert('عذراً، حدث خطأ أثناء معالجة الطلب. يمكنك المحاولة مرة أخرى أو التواصل معنا مباشرة عبر واتساب.');
    } finally {
      isOrderingRef.current = false;
      setIsOrdering(false);
    }
  };

  // --- DATA ---
  const filteredProducts = initialProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'الكل' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['الكل', ...Array.from(new Set(initialProducts.map(p => p.category).filter(Boolean)))];

  return (
    <>
      {/* Global Elements */}
      <div className="cursor" id="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" id="cursorRing" ref={ringRef}></div>
      <div className={`toast ${toastVisible ? 'show' : ''}`} id="toast">✨ تم إضافة المنتج للسلة!</div>

      <Navbar 
        cartCount={cart.length} 
        isOrdering={isOrdering} 
        handleCheckout={(e) => { e.preventDefault(); setIsCartOpen(true); }} 
        handleTrack={() => setIsTrackOpen(true)}
        handleLinkHover={handleLinkHover} 
      />
      
      {/* Modals */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        removeFromCart={removeFromCart}
        checkoutStep={checkoutStep}
        setCheckoutStep={setCheckoutStep}
        customerInfo={customerInfo}
        setCustomerInfo={setCustomerInfo}
        handleCheckout={handleCheckout}
        isOrdering={isOrdering}
        handleLinkHover={handleLinkHover}
      />

      <ProductDetailsModal 
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        addToCart={addToCart}
        handleLinkHover={handleLinkHover}
      />

      <OrderTrackingModal 
        isOpen={isTrackOpen}
        onClose={() => setIsTrackOpen(false)}
        handleLinkHover={handleLinkHover}
      />
      
      <Hero handleLinkHover={handleLinkHover} />

      <main>
        {/* Decorative Marquee */}
        <div className="marquee-section" aria-hidden="true">
          <div className="marquee-track">
            {['رزن يدوي', 'مجوهرات فريدة', 'إكسسوارات مخصصة', 'هدايا مميزة', 'صنع بحب', 'HOOR Art'].map((text, i) => (
              <span key={i}>{text}<span className="dot">✦</span></span>
            ))}
            {['رزن يدوي', 'مجوهرات فريدة', 'إكسسوارات مخصصة', 'هدايا مميزة', 'صنع بحب', 'HOOR Art'].map((text, i) => (
              <span key={i+10}>{text}<span className="dot">✦</span></span>
            ))}
          </div>
        </div>

        <Craftsmanship />

        {/* Section: Products */}
        <FeaturedProducts 
          filteredProducts={filteredProducts}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          categories={categories}
          addToCart={addToCart}
          onShowDetails={setSelectedProduct}
          handleLinkHover={handleLinkHover}
        />

        {/* Section: Custom Orders */}
        <StudioSection 
          customOrder={customOrder}
          setCustomOrder={setCustomOrder}
          addToCart={addToCart}
          setCheckoutStep={setCheckoutStep}
          setIsCartOpen={setIsCartOpen}
          handleLinkHover={handleLinkHover}
        />

        {/* Section: Branding & Trust */}
        <WhyUs />
        <Testimonials />
      </main>

      <Footer />
    </>
  );
}
