'use client';

import Image from 'next/image';
// @ts-ignore: Next.js supports importing PNGs
import logoImg from '../public/logo.PNG';

export default function Hero({ handleLinkHover }: { handleLinkHover: (t: boolean) => void }) {
  return (
    <section className="hero">
      <div className="hero-bg-overlay"></div>
      
      <div className="hero-content fade-up">
        <div className="hero-tag">
          <span>✧</span> فن يحاكي الروح
        </div>
        
        <h1 className="hero-title">
          فن الرزن <br /> <em>بمنظور</em> مختلف
        </h1>
        
        <p className="hero-sub">
          نحول شغفنا بالجمال إلى قطع فنية يدوية فريدة. 
          في استوديو HOOR، كل قطعة هي دعوة لاكتشاف التناغم بين الطبيعة والابتكار.
        </p>
        
        <div className="hero-btns">
          <a 
            href="#featured" 
            className="btn-primary" 
            onMouseEnter={() => handleLinkHover(true)} 
            onMouseLeave={() => handleLinkHover(false)}
          >
            استكشاف المجموعة ✦
          </a>
          <a 
            href="#custom" 
            className="btn-secondary" 
            onMouseEnter={() => handleLinkHover(true)} 
            onMouseLeave={() => handleLinkHover(false)}
          >
            الطلب الخاص
          </a>
        </div>
      </div>

      <div className="hero-visual-center fade-up" style={{ transitionDelay: '0.2s' }}>
        <div className="hero-main-img-wrapper">
          <Image
            src={logoImg}
            alt="HOOR Artisan Studio"
            priority
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        
        <div className="hero-floating-badge">
          <div className="label">إصدارات محدودة</div>
          <div className="value">صناعة يدوية 100%</div>
        </div>
      </div>
    </section>
  );
}

