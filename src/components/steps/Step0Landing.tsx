'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Truck, 
  Headphones, 
  Award, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Landmark,
  ArrowRight,
  ExternalLink,
  Percent
} from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import { FbrCertificateModal } from '../FbrCertificateModal';

const COLOR_SWATCHES = [
  { id: 'burgundy', name: 'Burgundy', tag: 'Deep & Elegant', hex: '#5c1d2e', border: '#7e2a40' },
  { id: 'glacier', name: 'Glacier', tag: 'Clean & Classic', hex: '#e2e8f0', border: '#cbd5e1' },
  { id: 'black', name: 'Black', tag: 'Sleek & Bold', hex: '#18181b', border: '#3f3f46' },
  { id: 'gold', name: 'Titanium Gold', tag: 'Warm & Luxurious', hex: '#d4af37', border: '#f59e0b' }
];

export const Step0Landing: React.FC = () => {
  const { setStep, setSelectedModel, modelsList } = useWizard();
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);
  const [activeColor, setActiveColor] = useState<string>('burgundy');
  const [heroSlide, setHeroSlide] = useState<number>(0);

  // Auto show certificate popup on first visit after a pleasant delay
  useEffect(() => {
    try {
      const hasSeenCert = sessionStorage.getItem('iml_fbr_cert_seen');
      if (!hasSeenCert) {
        const timer = setTimeout(() => {
          setIsCertModalOpen(true);
          sessionStorage.setItem('iml_fbr_cert_seen', 'true');
        }, 8000);
        return () => clearTimeout(timer);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const handleStartShopping = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewPlans = () => {
    const ip18 = modelsList.find(m => m.seriesId === 'apple-18') || modelsList[0];
    if (ip18) {
      setSelectedModel(ip18);
      setStep(2);
    } else {
      setStep(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectColorPlan = (colorId: string) => {
    const ip18 = modelsList.find(m => m.seriesId === 'apple-18') || modelsList[0];
    if (ip18) {
      setSelectedModel(ip18);
      setStep(2);
    } else {
      setStep(1);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="landing-root">
      {/* ========================================================
          0. FBR GOVERNMENT VERIFICATION STICKY TRUST PILL
          ======================================================== */}
      <div className="fbr-trust-ticker-wrap">
        <button 
          type="button" 
          className="fbr-trust-ticker-pill"
          onClick={() => setIsCertModalOpen(true)}
          title="Click to view Official Federal Board of Revenue Certificate"
        >
          <div className="fbr-ticker-left">
            <span className="fbr-ticker-live-dot" />
            <ShieldCheck size={14} color="#10b981" />
            <span className="fbr-ticker-text">
              <strong>Govt. FBR Verified Company</strong> • NTN # 3220385204351
            </span>
          </div>
          <span className="fbr-ticker-action">
            <span>View Certificate</span>
            <ChevronRight size={13} />
          </span>
        </button>
      </div>

      {/* ========================================================
          1. LUXURY HERO BANNER ("BUY NOW, PAY LATER")
          Exact match to Reference Image 1
          ======================================================== */}
      <section className="mockup-hero-section">
        <div className="mockup-hero-container">
          {/* Left Column: Model with iPhone and golden swirls */}
          <div className="mockup-hero-visual-col">
            <div className="mockup-hero-image-wrapper">
              <img 
                src="/hero-woman-model.jpg" 
                alt="Instalment Mobile Limited - Apple iPhone 18 Series in Easy Installments"
                className="mockup-hero-model-img"
              />
              
              {/* Script Overlay: "Dreams Now Within Reach ♡" */}
              <div className="mockup-hero-script-tag">
                <span>Dreams Now</span>
                <span>Within Reach ♡</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Content & CTAs */}
          <div className="mockup-hero-content-col">
            {/* Apple iPhone 18 Series Tag */}
            <div className="mockup-series-pill">
              <img 
                src="/apple-logo-white.png" 
                alt="Apple" 
                className="apple-pill-icon" 
              />
              <span>APPLE IPHONE 18 SERIES</span>
            </div>

            {/* Main Bold Headline */}
            <h1 className="mockup-hero-headline">
              <span className="headline-line-1">Buy Now,</span>
              <span className="headline-line-2">Pay Later</span>
            </h1>

            {/* Sub-features list */}
            <div className="mockup-hero-subtags">
              <span>Flexible Installments</span>
              <span className="subtag-sep">|</span>
              <span>Easy Process</span>
              <span className="subtag-sep">|</span>
              <span>No Extra Charges</span>
            </div>

            {/* 3 Value Icons in Row */}
            <div className="mockup-hero-badges-row">
              <div className="mockup-hero-badge-item">
                <Calendar size={18} className="badge-icon-gold" />
                <span>Flexible Installments</span>
              </div>

              <div className="mockup-hero-badge-item">
                <ShieldCheck size={18} className="badge-icon-gold" />
                <span>No Credit Card Required</span>
              </div>

              <div className="mockup-hero-badge-item">
                <Truck size={18} className="badge-icon-gold" />
                <span>Nationwide Delivery</span>
              </div>
            </div>

            {/* Big Gold Action Button & Subtext */}
            <div className="mockup-hero-cta-group">
              <button 
                type="button" 
                className="mockup-gold-cta-btn"
                onClick={handleStartShopping}
              >
                <span>Shop Now</span>
                <ArrowRight size={17} />
              </button>

              <div className="mockup-hero-side-slogan">
                <span>Bigger Dreams</span>
                <span>Smarter Choices</span>
              </div>
            </div>

            {/* Pagination Indicator Dots */}
            <div className="mockup-hero-dots">
              <span className={`dot-item ${heroSlide === 0 ? 'active' : ''}`} onClick={() => setHeroSlide(0)} />
              <span className="dot-line" />
              <span className={`dot-item ${heroSlide === 1 ? 'active' : ''}`} onClick={() => setHeroSlide(1)} />
              <span className="dot-line" />
              <span className={`dot-item ${heroSlide === 2 ? 'active' : ''}`} onClick={() => setHeroSlide(2)} />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. VALUE PROPOSITION STRIP (4 Gold Outlined Cards)
          Matching Image 1 strip below Hero
          ======================================================== */}
      <section className="mockup-value-strip">
        <div className="mockup-value-card">
          <div className="mockup-value-icon">
            <ShieldCheck size={18} />
          </div>
          <div className="mockup-value-text">
            <h4>100% Original Products</h4>
            <p>Official &amp; Sealed</p>
          </div>
        </div>

        <div className="mockup-value-card">
          <div className="mockup-value-icon">
            <Truck size={18} />
          </div>
          <div className="mockup-value-text">
            <h4>Fast &amp; Secure Delivery</h4>
            <p>Nationwide</p>
          </div>
        </div>

        <div className="mockup-value-card">
          <div className="mockup-value-icon">
            <Headphones size={18} />
          </div>
          <div className="mockup-value-text">
            <h4>24/7 Customer Support</h4>
            <p>Always Here</p>
          </div>
        </div>

        <div className="mockup-value-card">
          <div className="mockup-value-icon">
            <Award size={18} />
          </div>
          <div className="mockup-value-text">
            <h4>Trusted by Thousands</h4>
            <p>Happy Customers</p>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. MIDDLE SHOWCASE ("Own Your iPhone 18 with Easy Installments")
          Exact match to Reference Image 1 Middle Section
          ======================================================== */}
      <section className="mockup-middle-showcase">
        <div className="middle-showcase-grid">
          {/* Left Text & CTA Block */}
          <div className="middle-showcase-left">
            <span className="middle-gold-tag">
              PREMIUM INSTALLMENT PLANS
            </span>

            <h2 className="middle-main-title">
              Own Your iPhone 18<br />
              with Easy Installments
            </h2>

            <p className="middle-sub-points">
              No Check &nbsp;|&nbsp; No Statement &nbsp;|&nbsp; No Credit Card
            </p>

            <div className="middle-script-arrow-wrap">
              <span className="middle-cursive-gold">
                Flexible Plans<br />For a Brighter Tomorrow!
              </span>
            </div>

            <button 
              type="button" 
              className="middle-view-plans-btn"
              onClick={handleViewPlans}
            >
              <span>View Plans</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* Center Graphic: 3 iPhones on Pedestal with Golden Halos */}
          <div className="middle-showcase-center">
            <div className="middle-phones-pedestal-wrap">
              <img 
                src="/middle-phones-showcase.png" 
                alt="iPhone 18 Burgundy, White Glacier, and Black on glowing pedestal"
                className="middle-phones-img"
              />
            </div>
          </div>

          {/* Right Card: 0% MARKUP Badge */}
          <div className="middle-showcase-right">
            <div className="zero-markup-badge-card">
              <span className="zero-markup-pct">0%</span>
              <span className="zero-markup-word">MARKUP</span>
              <p className="zero-markup-desc">
                Pay in Easy Installments with No Extra Charges
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. ICONIC COLORS SECTION ("iPhone 18 Series")
          Exact match to Reference Image 1 Lower Showcase
          ======================================================== */}
      <section className="mockup-colors-section">
        <div className="colors-section-container">
          {/* Left Block: Color Selector & Information */}
          <div className="colors-info-col">
            <span className="colors-mini-tag">ICONIC COLORS</span>
            <h2 className="colors-headline">iPhone 18 Series</h2>
            <p className="colors-subtitle">
              Four stunning colors. One extraordinary experience.
            </p>

            {/* Swatches List */}
            <div className="colors-swatches-vertical">
              {COLOR_SWATCHES.map((swatch) => {
                const isActive = activeColor === swatch.id;
                return (
                  <div 
                    key={swatch.id}
                    className={`color-swatch-row ${isActive ? 'active' : ''}`}
                    onClick={() => setActiveColor(swatch.id)}
                  >
                    <span 
                      className="swatch-bullet"
                      style={{ 
                        background: swatch.hex,
                        boxShadow: isActive ? `0 0 10px ${swatch.hex}` : 'none'
                      }} 
                    />
                    <div className="swatch-details">
                      <strong className="swatch-name">{swatch.name}</strong>
                      <span className="swatch-desc">({swatch.tag})</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button 
              type="button" 
              className="explore-colors-cta"
              onClick={() => handleSelectColorPlan(activeColor)}
            >
              <span>Explore All Colors</span>
              <ArrowRight size={15} />
            </button>
          </div>

          {/* Center / Right: Lineup Graphic & Apple Seal */}
          <div className="colors-visual-col">
            <div className="colors-lineup-wrap">
              <img 
                src="/colors-lineup-phones.png" 
                alt="iPhone 18 Series Color Range Lineup"
                className="colors-lineup-img"
              />
            </div>

            <div className="colors-apple-seal">
              <img 
                src="/apple-logo-white.png" 
                alt="Apple" 
                className="apple-seal-logo" 
              />
              <div className="apple-seal-text">
                <span>PREMIUM</span>
                <span>DESIGN,</span>
                <span>TIMELESS</span>
                <span>COLORS.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. BOTTOM TEASER BANNER ("Your Next iPhone Is Closer Than You Think")
          Exact match to Reference Image 1 Pre-Footer Banner
          ======================================================== */}
      <section className="mockup-bottom-teaser">
        <div className="bottom-teaser-container">
          <div className="bottom-teaser-content">
            <div className="bottom-teaser-text-block">
              <h3>Your Next iPhone Is Closer Than You Think</h3>
              <p>Premium iPhones &nbsp;|&nbsp; Easy Installments &nbsp;|&nbsp; Trusted Partner</p>
            </div>

            <div className="bottom-teaser-action-block">
              <button 
                type="button" 
                className="bottom-teaser-shop-btn"
                onClick={handleStartShopping}
              >
                <span>Shop Now</span>
                <ArrowRight size={16} />
              </button>

              <span className="bottom-teaser-script">
                More Than Just<br />a Mobile Store
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          6. "OUR BANK PARTNERS" SECTION (Verified Official Channels)
          ======================================================== */}
      <section className="partners-section" id="partners">
        <div className="partners-container-card">
          <div className="partners-header-grid">
            <div className="bank-emblem-box">
              <div className="bank-pillar-icon">
                <Landmark size={18} color="#d4af37" />
              </div>
              <h4>OUR BANK PARTNERS</h4>
              <p>Multiple Payment Options for Your Convenience</p>
            </div>

            {/* 7 Bank / Wallet Partner Cards */}
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
                  src="/upaisa-light.png" 
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
                  src="/abhi-light.png" 
                  alt="ABHI Financing" 
                  style={{ height: '22px', width: 'auto', objectFit: 'contain', marginBottom: '2px' }} 
                />
                <span className="partner-brand-slogan">Salary &amp; EMI</span>
              </div>
            </div>
          </div>

          {/* Secure Trust Strip with FBR Quick Verification Button */}
          <div className="featured-islamic-partner">
            <div className="secure-badge-box">
              <div className="secure-badge-content">
                <ShieldCheck size={16} color="#34d399" style={{ flexShrink: 0 }} />
                <span className="secure-badge-text">
                  100% Secure &amp; Verified Official Banking Channels • Shariah Compliant Options
                </span>
              </div>

              <button 
                type="button" 
                className="fbr-inline-cert-btn"
                onClick={() => setIsCertModalOpen(true)}
              >
                <span>FBR Taxpayer Certificate</span>
                <ExternalLink size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. FBR CERTIFICATE POPUP MODAL
          ======================================================== */}
      <FbrCertificateModal 
        isOpen={isCertModalOpen} 
        onClose={() => setIsCertModalOpen(false)} 
      />
    </div>
  );
};
