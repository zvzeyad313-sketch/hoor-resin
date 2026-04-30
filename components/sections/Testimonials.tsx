'use client';

export default function Testimonials() {
  return (
    <section className="testimonials fade-up" style={{ background: 'var(--bone)', padding: '120px 60px' }}>
      <div className="section-header">
        <span className="label-sm">أصداء فنية</span>
        <h2 className="display-lg">رسائل من <em>القلب</em></h2>
      </div>
      <div className="testimonials-grid" style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="testimonial-card" style={{ background: 'white', borderRadius: '4px', border: '1px solid var(--sys-outline-variant)' }}>
          <div className="stars" aria-label="5 stars" style={{ marginBottom: '2rem' }}>✦ ✦ ✦ ✦ ✦</div>
          <p className="testimonial-text" style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '2.5rem' }}>"ربنا يبارك في الأيادي اللي صنعت الخاتم ده! جميل جداً وفاق توقعاتي بمراحل 😍 الشحن كان سريع والتغليف تحفة"</p>
          <div className="testimonial-author">
            <div className="avatar av-1" aria-hidden="true" style={{ background: 'var(--cream-dark)', filter: 'grayscale(1)' }}>👩</div>
            <div>
              <div className="author-name" style={{ fontSize: '1rem', fontWeight: 700 }}>سارة محمد</div>
              <div className="author-loc" style={{ fontSize: '0.8rem', opacity: 0.5 }}>📍 القاهرة</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
