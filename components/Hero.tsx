'use client';

import Image from 'next/image';
// @ts-ignore: Next.js supports importing PNGs, but TS might lack uppercase declaration
import logoImg from '../public/logo.PNG';

export default function Hero({ handleLinkHover }: { handleLinkHover: (t: boolean) => void }) {
  return (
    <section className="hero">
      <div className="hero-bg"></div>
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="hero-text fade-up">
        <div className="hero-tag"><span>✨</span> صنع بحب واهتمام</div>
        <h1 className="hero-title">
          تحف فنية <em>بيد</em><br />نفسك مع HOOR
        </h1>
        <p className="hero-sub">
          كل قطعة من HOOR هي تحفة يدوية مصنوعة بعناية فائقة.
          نصنع لكِ قطعاً فنية من الرزن تحكي قصتك وتزين مساحتك 💕
        </p>
        <div className="hero-btns">
          <a href="#featured" className="btn-primary" onMouseEnter={() => handleLinkHover(true)} onMouseLeave={() => handleLinkHover(false)}>تسوق الآن ✦</a>
          <a href="#custom" className="btn-secondary" onMouseEnter={() => handleLinkHover(true)} onMouseLeave={() => handleLinkHover(false)}>طلب خاص</a>
        </div>
      </div>

      <div className="hero-visual">
        <div className="hero-showcase">
          <div className="showcase-main">
            <Image
              src={logoImg}
              alt="HOOR Studio Logo"
              priority
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="float-card card-1">
            <div className="label">⭐ التقييم</div>
            <div className="value">4.9 / 5</div>
            <div className="sub">+200 عميل سعيد</div>
          </div>
          <div className="float-card card-2">
            <div className="label">🎨 مخصص 100%</div>
            <div className="value">يدوي الصنع</div>
            <div className="sub">كل قطعة فريدة</div>
          </div>
          <div className="hero-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </section>
  );
}
