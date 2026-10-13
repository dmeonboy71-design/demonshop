'use client';

import React from 'react';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Landmark, 
  Wallet, 
  Headphones, 
  Megaphone, 
  CheckCircle2, 
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
import { COMPANY_INFO, SUPPORTED_PAYMENT_CHANNELS } from '../../data/catalog';

export const Step0Landing: React.FC = () => {
  const { setStep } = useWizard();

  const handleStartShopping = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* ========================================================
          1. LUXURY HERO BANNER (iPhone 18 Pro Max Showcase)
          ======================================================== */}
      <section className="luxury-hero">
        <div className="hero-top-row">
          <div>
            <div className="gold-pill-tag">
              <Sparkles size={12} style={{ marginRight: 4 }} />
              NEW ARRIVAL
            </div>
            <h1 className="hero-main-heading">
              <svg width="28" height="28" viewBox="0 0 170 170" fill="currentColor">
                <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.69-7.85-12.01-14.42-6.1-9.35-10.8-19.78-14.1-31.29-3.3-11.51-4.96-22.37-4.96-32.58 0-14.42 3.69-26.31 11.07-35.68 7.38-9.37 16.58-14.13 27.6-14.28 4.58 0 9.87 1.25 15.87 3.75 6 2.5 10.15 3.8 12.44 3.9 1.9.11 6.09-1.25 12.58-4.08 6.49-2.83 11.96-4.04 16.42-3.63 12.63.85 22.84 5.48 30.63 13.9-11.03 6.74-16.42 16.14-16.16 28.2.26 9.47 3.83 17.51 10.71 24.13 6.88 6.62 15.17 10.42 24.87 11.4-2.18 6.53-4.9 13.06-8.16 19.59zM119.22 31.84c0-7.72 2.76-14.9 8.27-21.54 5.51-6.64 12.33-10.3 20.47-10.3.36 1.09.54 2.22.54 3.4 0 7.72-2.85 15.02-8.54 21.9-5.69 6.88-12.63 10.54-20.82 10.98.05-1.46.08-2.94.08-4.44z"/>
              </svg>
              iPhone 18 Pro Max
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

        {/* 4 Feature Badges */}
        <div className="hero-features-grid">
          <div className="feature-box">
            <div className="feature-box-icon">
              <Cpu size={16} />
            </div>
            <span className="feature-box-title">A20 PRO CHIP</span>
            <span className="feature-box-desc">Next Level Performance</span>
          </div>

          <div className="feature-box">
            <div className="feature-box-icon">
              <Camera size={16} />
            </div>
            <span className="feature-box-title">PRO CAMERA SYSTEM</span>
            <span className="feature-box-desc">48MP | 4K | ProRAW</span>
          </div>

          <div className="feature-box">
            <div className="feature-box-icon">
              <Monitor size={16} />
            </div>
            <span className="feature-box-title">6.9&quot; SUPER RETINA</span>
            <span className="feature-box-desc">XDR Display • Brighter</span>
          </div>

          <div className="feature-box">
            <div className="feature-box-icon">
              <BatteryCharging size={16} />
            </div>
            <span className="feature-box-title">ALL DAY BATTERY</span>
            <span className="feature-box-desc">Faster Charging</span>
          </div>
        </div>

        {/* Callout */}
        <div className="hero-callout-wrap">
          <span className="cursive-gold hero-callout-script">Your Dream Phone</span>
          <span className="hero-callout-sub">NOW IN EASY INSTALLMENTS</span>
        </div>

        {/* Visual Pedestal Showcase */}
        <div className="showcase-pedestal-wrap">
          <img 
            src="/iml-hero.jpg" 
            alt="iPhone 18 Pro Max All Titanium Colors"
            className="showcase-img"
          />
        </div>

        {/* Color Swatches */}
        <div className="color-swatches-strip">
          <div className="swatch-item">
            <span className="swatch-circle" style={{ background: '#1c1c1e' }} />
            <span>Titanium Black</span>
          </div>
          <div className="swatch-item">
            <span className="swatch-circle" style={{ background: '#f2f2f7' }} />
            <span>Titanium White</span>
          </div>
          <div className="swatch-item">
            <span className="swatch-circle" style={{ background: '#d4af37' }} />
            <span>Titanium Gold</span>
          </div>
          <div className="swatch-item">
            <span className="swatch-circle" style={{ background: '#3b5368' }} />
            <span>Titanium Blue</span>
          </div>
          <div className="swatch-item">
            <span className="swatch-circle" style={{ background: '#c68b59' }} />
            <span>Titanium Orange</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. VALUE PROPOSITION STRIP (4 Gold Outlined Cards)
          ======================================================== */}
      <section className="value-props-strip">
        <div className="value-prop-card">
          <div className="value-prop-icon">
            <ShieldCheck size={18} />
          </div>
          <div className="value-prop-content">
            <span className="value-prop-title">TRUSTED PAYMENTS</span>
            <span className="value-prop-subtitle">100% Secure</span>
          </div>
        </div>

        <div className="value-prop-card">
          <div className="value-prop-icon">
            <Landmark size={18} />
          </div>
          <div className="value-prop-content">
            <span className="value-prop-title">WIDE ACCEPTANCE</span>
            <span className="value-prop-subtitle">All Major Banks</span>
          </div>
        </div>

        <div className="value-prop-card">
          <div className="value-prop-icon">
            <Wallet size={18} />
          </div>
          <div className="value-prop-content">
            <span className="value-prop-title">FLEXIBLE TENURE</span>
            <span className="value-prop-subtitle">3 to 48 Months</span>
          </div>
        </div>

        <div className="value-prop-card">
          <div className="value-prop-icon">
            <Headphones size={18} />
          </div>
          <div className="value-prop-content">
            <span className="value-prop-title">24/7 SUPPORT</span>
            <span className="value-prop-subtitle">Always Here</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. "BUY NOW, PAY LATER!" GOLDEN RIBBON
          ======================================================== */}
      <div className="bnpl-ribbon">
        <div className="bnpl-left">
          <Megaphone size={26} className="bnpl-mega-icon" />
          <span className="bnpl-title">BUY NOW, PAY LATER!</span>
        </div>
        <button 
          type="button" 
          className="bnpl-badge-btn"
          onClick={handleStartShopping}
        >
          EASY INSTALLMENT PLANS FOR YOUR FAVORITE PHONES
        </button>
      </div>

      {/* ========================================================
          4. "OUR BANK PARTNERS" SECTION (As Specified in PDF & User)
          ======================================================== */}
      <section className="partners-section" id="partners">
        <div className="partners-container-card">
          <div className="partners-header-grid">
            {/* Left Bank Emblem Card */}
            <div className="bank-emblem-box">
              <Landmark size={24} color="#d4af37" />
              <h4>OUR BANK PARTNERS</h4>
              <p>Multiple Payment Options for Your Convenience</p>
            </div>

            {/* Partner Logos Grid */}
            <div className="partner-logos-row">
              {/* 1. Easypaisa */}
              <div className="partner-logo-pill">
                <img src="/easypaisa.webp" alt="Easypaisa" />
                <span>easypaisa</span>
              </div>

              {/* 2. UPaisa */}
              <div className="partner-logo-pill">
                <img src="/upaisa.png" alt="UPaisa" />
                <span>upaisa</span>
              </div>

              {/* 3. Bank Alfalah */}
              <div className="partner-logo-pill">
                <img src="/alflah.png" alt="Bank Alfalah" />
                <span>Bank Alfalah</span>
              </div>

              {/* 4. Askari Bank */}
              <div className="partner-logo-pill">
                <div style={{ color: '#0369a1', fontWeight: 900, fontSize: '11px', letterSpacing: '-0.3px' }}>
                  askari bank
                </div>
                <span>Askari Bank</span>
              </div>

              {/* 5. Payway / Zindigi */}
              <div className="partner-logo-pill">
                <div style={{ color: '#0d9488', fontWeight: 900, fontSize: '11px' }}>
                  Payway
                </div>
                <span>By JS Bank</span>
              </div>
            </div>
          </div>

          {/* Featured Islamic Digital Bank + Secure Badge */}
          <div className="featured-islamic-partner">
            <div className="raqami-card">
              <div className="islamic-geom-icon">
                ✦
              </div>
              <div className="raqami-details">
                <h5>Raqami Islamic Digital Bank</h5>
                <p>Shariah Compliant • Digital Banking</p>
              </div>
            </div>

            <div className="secure-badge-box">
              <ShieldCheck size={18} color="#34d399" />
              <span>Secure &amp; Trusted Banking Partners</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. 6 TRUST BADGES GRID
          ======================================================== */}
      <section className="trust-grid-section">
        <div className="trust-card">
          <div className="trust-card-icon">
            <Smartphone size={18} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">ORIGINAL PRODUCTS</span>
            <span className="trust-card-subtitle">100% Genuine</span>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-card-icon">
            <Wallet size={18} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">EASY INSTALLMENTS</span>
            <span className="trust-card-subtitle">Up to 48 Months</span>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-card-icon">
            <Percent size={18} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">0% MARKUP</span>
            <span className="trust-card-subtitle">No Hidden Charges</span>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-card-icon">
            <Truck size={18} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">CASH ON DELIVERY</span>
            <span className="trust-card-subtitle">Nationwide</span>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-card-icon">
            <CreditCard size={18} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">CARDS ACCEPTED</span>
            <span className="trust-card-subtitle">All Major Cards</span>
          </div>
        </div>

        <div className="trust-card">
          <div className="trust-card-icon">
            <Award size={18} />
          </div>
          <div className="trust-card-info">
            <span className="trust-card-title">100% ORIGINAL</span>
            <span className="trust-card-subtitle">Official Warranty</span>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. MAIN CTA BUTTON & TAGLINE
          ======================================================== */}
      <div className="hero-cta-wrap">
        <button 
          type="button" 
          className="big-gold-cta-btn"
          onClick={handleStartShopping}
        >
          <span>🛒 Shop Now</span>
          <ChevronRight size={18} />
        </button>
        <p className="cta-sub-tagline">
          LATEST PHONES &nbsp;|&nbsp; BEST PRICES &nbsp;|&nbsp; YOUR TRUST, OUR PRIORITY
        </p>
      </div>
    </div>
  );
};
