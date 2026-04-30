'use client';

import { Product, CustomOrder } from '@/lib/types';

type StudioSectionProps = {
  customOrder: CustomOrder;
  setCustomOrder: React.Dispatch<React.SetStateAction<CustomOrder>>;
  addToCart: (p: Product) => void;
  setCheckoutStep: (step: 'cart' | 'info') => void;
  setIsCartOpen: (open: boolean) => void;
  handleLinkHover: (t: boolean) => void;
};

export default function StudioSection({
  customOrder,
  setCustomOrder,
  addToCart,
  setCheckoutStep,
  setIsCartOpen,
  handleLinkHover
}: StudioSectionProps) {
  const handleCustomOrderSubmit = (e: React.FormEvent) => {
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
  };

  return (
    <section className="studio-section fade-up" id="custom">
      <div className="studio-container">
        <div className="studio-content">
          <span className="label-sm">تجربة فريدة</span>
          <h2 className="display-lg">الكونسيرج <em>الخاص</em></h2>
          <p className="body-lg" style={{ marginBottom: '3rem', maxWidth: '500px', opacity: 0.8 }}>
            في HOOR، نؤمن أن كل عميل هو فنان بطبعه. استوديو "الكونسيرج" هو بوابتك لتحويل رؤيتك الشخصية إلى قطعة أثرية فريدة تصنع يدوياً من أجلك فقط.
          </p>

          <div className="studio-process">
            {[
              { num: 'I', title: 'صياغة الرؤية', desc: 'نبدأ بالاستماع لأفكارك، الألوان المفضلة، والمناسبة التي تخلدها هذه القطعة.' },
              { num: 'II', title: 'الاختيار الدقيق', desc: 'ننسق بين أنواع الرزن، المعادن، والزهور الطبيعية للوصول لأفضل تركيبة.' },
              { num: 'III', title: 'التجسيد الفني', desc: 'يتم صب القطعة في استوديو HOOR بكل حب، لتخرج كتحفة فنية لا تتكرر.' }
            ].map(step => (
              <div key={step.num} className="process-step">
                <div className="step-badge" aria-hidden="true" style={{ fontFamily: 'serif', fontStyle: 'italic', background: 'var(--gold)', color: 'white' }}>{step.num}</div>
                <div className="step-info">
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.85rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
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
                  onChange={(e) => setCustomOrder(prev => ({ ...prev, size: e.target.value as any }))}
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
                onClick={handleCustomOrderSubmit}
                onMouseEnter={() => handleLinkHover(true)} 
                onMouseLeave={() => handleLinkHover(false)}
              >
                <span>الاستمرار لبيانات الشحن</span>
                <span>✦</span>
              </button>
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', opacity: 0.6, marginTop: '1.5rem' }}>* سيتم تحديد التكلفة النهائية بعد مراجعة التفاصيل</p>
          </div>
        </div>
      </div>
    </section>
  );
}
