'use client';

export default function WhyUs() {
  const reasons = [
    { icon: '🤲', title: 'صنع يدوي 100%', desc: 'كل قطعة تتصنع بإيدينا بكل حب واهتمام، مفيش قطعتين زي بعض أبداً' },
    { icon: '🌿', title: 'خامات عالية الجودة', desc: 'بنستخدم رزن وألوان عالمية آمنة وتدوم لسنين طويلة' },
    { icon: '💝', title: 'تغليف مميز', desc: 'كل طلب بيتغلف بعناية في علبة هدية جميلة، مناسب للهدايا الخاصة' },
    { icon: '🚚', title: 'توصيل لكل مكان', desc: 'بنوصّل لكل محافظات مصر، والشحن متاح لجميع الأماكن' }
  ];

  return (
    <section className="why fade-up" id="about" style={{ background: 'var(--cream-dark)', padding: '120px 60px' }}>
      <div className="section-header">
        <span className="label-sm">قيمنا الفنية</span>
        <h2 className="display-lg">لماذا <em>HOOR</em>؟</h2>
      </div>
      <div className="why-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {reasons.map((reason, i) => (
          <div key={i} className="why-card" style={{ background: 'white', borderRadius: '4px' }}>
            <span className="why-icon" aria-hidden="true" style={{ filter: 'grayscale(1)', opacity: 0.8 }}>{reason.icon}</span>
            <h3 className="why-title" style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{reason.title}</h3>
            <p className="why-desc" style={{ fontSize: '0.9rem', opacity: 0.7 }}>{reason.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
