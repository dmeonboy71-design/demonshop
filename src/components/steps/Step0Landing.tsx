'use client';

import React from 'react';
import { 
  ShieldCheck, 
  Landmark, 
  Wallet, 
  Headphones, 
  Megaphone, 
  Percent, 
  Truck, 
  CreditCard, 
  Award, 
  Smartphone, 
  ChevronRight, 
  Sparkles, 
  Cpu, 
  Camera, 
  Monitor, 
  BatteryCharging 
} from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import { COMPANY_INFO } from '../../data/catalog';

export const Step0Landing: React.FC = () => {
  const { setStep } = useWizard();

  const handleStartShopping = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-root">
      {/* ========================================================
          1. LUXURY HERO BANNER (iPhone 18 Pro Max Showcase)
          ======================================================== */}
      <section className="luxury-hero">
        {/* Top Header Row in Hero */}
        <div className="hero-top-row">
          <div className="hero-title-group">
            <div className="gold-pill-tag">
              <Sparkles size={10} style={{ marginRight: 3 }} />
              NEW ARRIVAL
            </div>
            <h1 className="hero-main-heading">
              <img 
                src="/apple-logo-white.png" 
                alt="Apple" 
                className="apple-white-logo-icon" 
              />
              <span className="hero-title-text">iPhone 18 Pro Max</span>
            </h1>
            <p className="hero-sub-specs">
              BIGGER • SMARTER • MORE POWERFUL
            </p>
          </div>

          <div className="floating-spec-badge">
            <h5>iPhone 18 Pro Max</h5>
            <p>256GB | 512GB | 1TB</p>
          </div>
        </div>

        {/* 2-Column Split: Specs + Script on Left, Phones Graphic on Right */}
        <div className="hero-split-body">
          <div className="hero-left-column">
            {/* 4 Feature Badges Grid */}
            <div className="hero-features-grid">
              <div className="feature-box">
                <div className="feature-box-icon">
                  <Cpu size={13} />
                </div>
                <div className="feature-box-text">
                  <span className="feature-box-title">A20 PRO CHIP</span>
                  <span className="feature-box-desc">Next Level Performance</span>
                </div>
              </div>

              <div className="feature-box">
                <div className="feature-box-icon">
                  <Camera size={13} />
                </div>
                <div className="feature-box-text">
                  <span className="feature-box-title">PRO CAMERA SYSTEM</span>
                  <span className="feature-box-desc">48MP | 4K | ProRAW</span>
                </div>
              </div>

              <div className="feature-box">
                <div className="feature-box-icon">
                  <Monitor size={13} />
                </div>
                <div className="feature-box-text">
                  <span className="feature-box-title">6.9&quot; SUPER RETINA</span>
                  <span className="feature-box-desc">Brighter. Clearer.</span>
                </div>
              </div>

              <div className="feature-box">
                <div className="feature-box-icon">
                  <BatteryCharging size={13} />
                </div>
                <div className="feature-box-text">
                  <span className="feature-box-title">ALL DAY BATTERY</span>
                  <span className="feature-box-desc">Faster Charging</span>
                </div>
              </div>
            </div>

            {/* Script Callout */}
            <div className="hero-callout-wrap">
              <span className="cursive-gold hero-callout-script">Your Dream Phone</span>
              <span className="hero-callout-sub">NOW IN EASY INSTALLMENTS</span>
            </div>
          </div>

          {/* Graphic Illustration on Right */}
          <div className="hero-right-column">
            <div className="pedestal-graphic-wrap">
              <img 
                src="/iphone-lineup-graphic.png" 
                alt="iPhone 18 Pro Max Titanium Color Lineup on Pedestal"
                className="pedestal-phones-graphic"
              />
            </div>

            {/* Color Swatches */}
            <div className="color-swatches-strip">
              <div className="swatch-item">
                <span className="swatch-circle" style={{ background: '#1c1c1e' }} />
                <span>Black</span>
              </div>
              <div className="swatch-item">
                <span className="swatch-circle" style={{ background: '#f2f2f7' }} />
                <span>White</span>
              </div>
              <div className="swatch-item">
                <span className="swatch-circle" style={{ background: '#d4af37' }} />
                <span>Gold</span>
              </div>
              <div className="swatch-item">
                <span className="swatch-circle" style={{ background: '#3b5368' }} />
                <span>Blue</span>
              </div>
              <div className="swatch-item">
                <span className="swatch-circle" style={{ background: '#c68b59' }} />
                <span>Orange</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. VALUE PROPOSITION STRIP (4 Gold Outlined Cards)
          ======================================================== */}
      <section className="value-props-strip">
        <div className="value-prop-card">
          <div className="value-prop-icon">
            <ShieldCheck size={14} />
          </div>
          <div className="value-prop-content">
            <span className="value-prop-title">TRUSTED PAYMENTS</span>
            <span className="value-prop-subtitle">100% Secure</span>
          </div>
        </div>

        <div className="value-prop-card">
          <div className="value-prop-icon">
            <Landmark size={14} />
          </div>
          <div className="value-prop-content">
            <span className="value-prop-title">WIDE ACCEPTANCE</span>
            <span className="value-prop-subtitle">All Major Banks</span>
          </div>
        </div>

        <div className="value-prop-card">
          <div className="value-prop-icon">
            <Wallet size={14} />
          </div>
          <div className="value-prop-content">
            <span className="value-prop-title">FLEXIBLE TENURE</span>
            <span className="value-prop-subtitle">3 to 36 Months</span>
          </div>
        </div>

        <div className="value-prop-card">
          <div className="value-prop-icon">
            <Headphones size={14} />
          </div>
          <div className="value-prop-content">
            <span className="value-prop-title">24/7 SUPPORT</span>
            <span className="value-prop-subtitle">Always Here</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. MAIN SHOP NOW BUTTON (PLACED ABOVE BUY NOW PAY LATER)
          Clear, prominent, perfectly centered on phone and desktop!
          ======================================================== */}
      <div className="hero-cta-wrap hero-cta-top">
        <button 
          type="button" 
          className="big-gold-cta-btn"
          onClick={handleStartShopping}
        >
          <span className="cart-cta-icon">🛒</span>
          <span className="cta-btn-label">Shop Now</span>
          <ChevronRight size={17} />
        </button>
        <p className="cta-sub-tagline">
          LATEST PHONES &nbsp;|&nbsp; BEST PRICES &nbsp;|&nbsp; YOUR TRUST, OUR PRIORITY
        </p>
      </div>

      {/* ========================================================
          4. "BUY NOW, PAY LATER!" GOLDEN RIBBON
          Responsive: Text on left, button beside it on right!
          ======================================================== */}
      <div className="bnpl-ribbon">
        <div className="bnpl-left">
          <Megaphone size={18} className="bnpl-mega-icon" />
          <span className="bnpl-title">BUY NOW, PAY LATER!</span>
        </div>
        <button 
          type="button" 
          className="bnpl-badge-btn"
          onClick={handleStartShopping}
        >
          <span>EASY INSTALLMENT PLANS</span>
          <span className="bnpl-sub">FOR YOUR FAVORITE PHONES</span>
        </button>
      </div>

      {/* ========================================================
          5. "OUR BANK PARTNERS" SECTION (As in 2nd Image)
          ======================================================== */}
      <section className="partners-section" id="partners">
        <div className="partners-container-card">
          <div className="partners-header-grid">
            {/* Left Bank Emblem Card */}
            <div className="bank-emblem-box">
              <div className="bank-pillar-icon">
                <Landmark size={18} color="#d4af37" />
              </div>
              <h4>OUR BANK PARTNERS</h4>
              <p>Multiple Payment Options for Your Convenience</p>
            </div>

            {/* 7 Bank / Wallet / Financing Partner Cards in a row */}
            <div className="partner-logos-row">
              {/* 1. Easypaisa */}
              <div className="partner-logo-pill">
                <img 
                  src="/easypaisa.webp" 
                  alt="Easypaisa" 
                  style={{ height: '24px', width: 'auto', objectFit: 'contain', marginBottom: '2px' }} 
                />
                <span className="partner-brand-slogan">Khushiyon Bhara Aghez</span>
              </div>

              {/* 2. UPaisa */}
              <div className="partner-logo-pill">
                <img 
                  src="/upaisa.png" 
                  alt="UPaisa" 
                  style={{ height: '22px', width: 'auto', objectFit: 'contain', marginBottom: '2px' }} 
                />
                <span className="partner-brand-slogan">Digital Payments</span>
              </div>

              {/* 3. Bank Alfalah */}
              <div className="partner-logo-pill">
                <img 
                  src="/alflah.png" 
                  alt="Bank Alfalah" 
                  style={{ height: '24px', width: 'auto', objectFit: 'contain', marginBottom: '2px' }} 
                />
                <span className="partner-brand-slogan" style={{ color: '#d31820' }}>The Way Forward</span>
              </div>

              {/* 4. Askari Bank */}
              <div className="partner-logo-pill">
                <img 
                  src="/askari.png" 
                  alt="Askari Bank" 
                  style={{ height: '26px', width: 'auto', objectFit: 'contain', marginBottom: '2px' }} 
                />
                <span className="partner-brand-slogan">Askari Bank</span>
              </div>

              {/* 5. Payway Pakistan */}
              <div className="partner-logo-pill">
                <img 
                  src="/payway.png" 
                  alt="Payway Pakistan" 
                  style={{ height: '20px', width: 'auto', objectFit: 'contain', marginBottom: '2px' }} 
                />
                <span className="partner-brand-slogan">Payway Pakistan</span>
              </div>

              {/* 6. Raqami Islamic Digital Bank */}
              <div className="partner-logo-pill partner-logo-raqami">
                <img 
                  src="/raqami-logo-card.png" 
                  alt="Raqami Islamic Digital Bank" 
                  className="raqami-pill-logo-img" 
                />
              </div>

              {/* 7. ABHI Financing */}
              <div className="partner-logo-pill">
                <img 
                  src="/abhi.png" 
                  alt="ABHI Financing" 
                  style={{ height: '22px', width: 'auto', objectFit: 'contain', marginBottom: '2px' }} 
                />
                <span className="partner-brand-slogan">Salary &amp; EMI</span>
              </div>
            </div>
          </div>

          {/* Secure Trust Strip */}
          <div className="featured-islamic-partner">
            <div className="secure-badge-box" style={{ width: '100%', justifyContent: 'center' }}>
              <ShieldCheck size={14} color="#34d399" />
              <span>100% Secure &amp; Verified Official Banking Channels</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. 6 TRUST BADGES GRID (Cards with glowing borders)
          ======================================================== */}
      <section className="trust-grid-section">
        <div className="trust-card">
          <div className="trust-card-icon">
            <Smartphone size={15} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">ORIGINAL PRODUCTS</span>
            <span className="trust-card-subtitle">100% Genuine</span>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-card-icon">
            <Wallet size={15} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">EASY INSTALLMENTS</span>
            <span className="trust-card-subtitle">Up to 36 Months</span>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-card-icon">
            <Percent size={15} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">0% MARKUP</span>
            <span className="trust-card-subtitle">No Hidden Charges</span>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-card-icon">
            <Truck size={15} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">CASH ON DELIVERY</span>
            <span className="trust-card-subtitle">Nationwide</span>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-card-icon">
            <CreditCard size={15} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">CARDS ACCEPTED</span>
            <span className="trust-card-subtitle">All Major Cards</span>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-card-icon">
            <Award size={15} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">100% ORIGINAL</span>
            <span className="trust-card-subtitle">Official Warranty</span>
          </div>
        </div>
      </section>
    </div>
  );
};
