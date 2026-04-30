'use client';

export default function Footer() {
  return (
    <footer id="contact">
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="logo-f">HOOR <span>✧</span></span>
          <p>
            "نحن لا نصنع مجرد إكسسوارات، نحن نخلد لحظاتكم في قطع فنية تدوم للأبد. HOOR هو شغف تجسد في مادة الرزن، ليصل إلى قلوبكم قبل منازلكم."
          </p>
          <div className="social-links">
            <a href="https://www.instagram.com/hoor_resin_" target="_blank" rel="noreferrer" className="social-link" aria-label="Instagram">📸</a>
            <a href="https://www.tiktok.com/@hoor40726676" target="_blank" rel="noreferrer" className="social-link" aria-label="TikTok">🎵</a>
            <a href="https://www.facebook.com/Caesarewear" target="_blank" rel="noreferrer" className="social-link" aria-label="Facebook">👤</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>المجموعات</h4>
          <ul>
            <li><a href="#featured">القطع المختارة</a></li>
            <li><a href="#featured">إصدارات محدودة</a></li>
            <li><a href="#custom">الطلب الخاص</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>الاستوديو</h4>
          <ul>
            <li><a href="#custom">الكونسيرج</a></li>
            <li><a href="#contact">تواصل مباشر</a></li>
            <li><a href="#">قصتنا</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>القوانين</h4>
          <ul>
            <li><a href="#">سياسة الشحن</a></li>
            <li><a href="#">الاستبدال والاسترجاع</a></li>
            <li><a href="#">الخصوصية</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 HOOR ARTISAN STUDIO — القاهرة، مصر</span>
        <span>صنع بحب ❤️ بواسطة Ali Versel</span>
      </div>
    </footer>
  );
}

