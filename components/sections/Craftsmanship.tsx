'use client';

export default function Craftsmanship() {
  return (
    <section className="craft-section">
      <div className="craft-container">
        <div className="craft-visual fade-up">
           <div className="craft-img-stack">
              <div className="craft-img-large">
                <div className="placeholder-art" style={{ background: 'var(--cream-dark)', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🍯</div>
              </div>
              <div className="craft-img-small">
                <div className="placeholder-art" style={{ background: 'var(--gold)', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>✨</div>
              </div>
           </div>
        </div>
        
        <div className="craft-content fade-up">
          <span className="label-sm">حرفية يدوية</span>
          <h2 className="display-lg" style={{ marginBottom: '2rem' }}>الدقة في كل <em>تفصيلة</em></h2>
          <p className="body-lg" style={{ marginBottom: '2rem' }}>
            نحن لا نصنع مجرد إكسسوارات؛ نحن نصمم قطعاً تحمل في طياتها ساعات من الصبر والدقة. من اختيار أجود أنواع الرزن إلى دمج بتلات الزهور الطبيعية ورقائق الذهب، تمر كل قطعة برحلة حرفية تبدأ من الخيال وتنتهي بين يديك.
          </p>
          <div className="craft-stats">
            <div className="stat-item">
              <span className="stat-val">100%</span>
              <span className="stat-label">يدوي الصنع</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">أصلية</span>
              <span className="stat-label">مواد طبيعية</span>
            </div>
            <div className="stat-item">
              <span className="stat-val">فريدة</span>
              <span className="stat-label">لا تتكرر</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
