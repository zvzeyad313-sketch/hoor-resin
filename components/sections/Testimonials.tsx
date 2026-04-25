'use client';

export default function Testimonials() {
  return (
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
        {/* Additional testimonials could be mapped here */}
      </div>
    </section>
  );
}
