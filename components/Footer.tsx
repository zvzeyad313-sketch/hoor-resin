'use client';

export default function Footer() {
  return (
    <footer id="contact">
      <div className="footer-grid">
        <div className="footer-brand">
          <span className="logo-f">Hoor <span>✦</span> Resin</span>
          <p>متجر رزن يدوي متخصص في قطع فريدة مصنوعة بحب واهتمام. نصنع حلمك بأيدينا 💕</p>
          <div className="social-links">
            <a href="https://www.instagram.com/hoor_resin_" target="_blank" rel="noreferrer" className="social-link">📸</a>
            <a href="https://www.tiktok.com/@hoor40726676" target="_blank" rel="noreferrer" className="social-link">🎵</a>
            <a href="https://www.facebook.com/Caesarewear" target="_blank" rel="noreferrer" className="social-link">👤</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>المتجر</h4>
          <ul>
            <li><a href="#featured">جميع المنتجات</a></li>
            <li><a href="#">مجوهرات</a></li>
            <li><a href="#">ديكور</a></li>
            <li><a href="#">هدايا</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>خدماتنا</h4>
          <ul>
            <li><a href="#custom">طلبات خاصة</a></li>
            <li><a href="#">هدايا بالجملة</a></li>
            <li><a href="#">تعليم الرزن</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>تواصل معنا</h4>
          <ul>
            <li><a href="https://www.instagram.com/hoor_resin_" target="_blank" rel="noreferrer">إنستاجرام</a></li>
            <li><a href="https://www.tiktok.com/@hoor40726676" target="_blank" rel="noreferrer">تيك توك</a></li>
            <li><a href="https://www.facebook.com/Caesarewear" target="_blank" rel="noreferrer">فيسبوك</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2024 Hoor Resin Art — جميع الحقوق محفوظة</span>
        <span>صنع بحب ❤️ بواسطة Ali Versel</span>
      </div>
    </footer>
  );
}
