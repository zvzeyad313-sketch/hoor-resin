'use client';

export default function WhyUs() {
  const reasons = [
    { icon: '🤲', title: 'صنع يدوي 100%', desc: 'كل قطعة تتصنع بإيدينا بكل حب واهتمام، مفيش قطعتين زي بعض أبداً' },
    { icon: '🌿', title: 'خامات عالية الجودة', desc: 'بنستخدم رزن وألوان عالمية آمنة وتدوم لسنين طويلة' },
    { icon: '💝', title: 'تغليف مميز', desc: 'كل طلب بيتغلف بعناية في علبة هدية جميلة، مناسب للهدايا الخاصة' },
    { icon: '🚚', title: 'توصيل لكل مكان', desc: 'بنوصّل لكل محافظات مصر، والشحن متاح لجميع الأماكن' }
  ];

  return (
    <section className="why fade-up" id="about">
      <div className="section-header">
        <span className="section-label">✦ ليه Hoor</span>
        <h2 className="section-title">لأننا <em>نهتم</em> بكل تفصيلة</h2>
      </div>
      <div className="why-grid">
        {reasons.map((reason, i) => (
          <div key={i} className="why-card">
            <span className="why-icon" aria-hidden="true">{reason.icon}</span>
            <h3 className="why-title">{reason.title}</h3>
            <p className="why-desc">{reason.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
