'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Trash2, 
  ChevronRight, 
  ShieldCheck, 
  Smartphone, 
  Percent, 
  Clock, 
  CreditCard,
  Sparkles,
  ShoppingBag
} from 'lucide-react';
import { Header } from '../../components/Header';
import { useWizard } from '../../context/WizardContext';
import { COMPANY_INFO, EMI_TENURES, BRANDS } from '../../data/catalog';

export default function CartPage() {
  const router = useRouter();
  const { 
    selectedModel, 
    setSelectedModel,
    selectedColor, 
    setSelectedColor,
    selectedStorage,
    setSelectedStorage,
    selectedTenureMonths,
    setSelectedTenureMonths,
    calculatedTotalPrice,
    calculatedDownPayment,
    calculatedBalance,
    calculatedMonthlyEmi,
    setStep
  } = useWizard();

  const handleProceedToCheckout = () => {
    // Jump straight to Step 3 (Customer verification & application)
    setStep(3);
    router.push('/');
  };

  const handleConfigurePlan = () => {
    // Jump to Step 2 (Plan & Tenure configuration)
    setStep(2);
    router.push('/');
  };

  const handleBrowsePhones = () => {
    // Jump to Step 1 (Phone catalog)
    setStep(1);
    router.push('/');
  };

  const handleClearCart = () => {
    setSelectedModel(null);
  };

  return (
    <div className="main-wrapper">
      <Header />

      <div className="cart-page-content" style={{ padding: '20px 16px 80px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Breadcrumb & Title */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Link href="/" className="btn-outline-back" style={{ padding: '7px 12px' }}>
              <ArrowLeft size={15} />
            </Link>
            <div>
              <h1 style={{ fontSize: '19px', fontWeight: 800, color: '#ffffff' }}>Your Shopping Cart</h1>
              <p style={{ fontSize: '11px', color: '#94a3b8' }}>
                Review selected device &amp; installment scheme
              </p>
            </div>
          </div>

          {selectedModel && (
            <button
              type="button"
              onClick={handleClearCart}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                borderRadius: 12,
                padding: '6px 10px',
                fontSize: 11,
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                cursor: 'pointer'
              }}
              title="Remove item"
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          )}
        </div>

        {!selectedModel ? (
          /* Empty Cart State */
          <div 
            style={{
              background: '#0d0e14',
              border: '1px dashed rgba(212, 175, 55, 0.35)',
              borderRadius: 20,
              padding: '50px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 14,
              marginTop: 20
            }}
          >
            <div 
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.12)',
                color: 'var(--gold-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <ShoppingBag size={30} />
            </div>

            <div>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#ffffff' }}>Your Cart is Empty</h3>
              <p style={{ fontSize: 12, color: '#94a3b8', maxWidth: 300, margin: '6px auto 0' }}>
                You have not selected an iPhone installment plan yet. Choose your favorite device to view official installment terms.
              </p>
            </div>

            <button
              type="button"
              className="btn-gold-action"
              onClick={handleBrowsePhones}
              style={{ marginTop: 8 }}
            >
              <Smartphone size={15} />
              <span>Browse iPhone Models</span>
            </button>
          </div>
        ) : (
          /* Active Cart Item & Plan Breakdown */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Device Card */}
            {(() => {
              const brandObj = BRANDS.find((b) => b.id === selectedModel.brandId);
              const brandLogo = brandObj?.logoUrl || '/apple-logo-white.png';
              const isProductImage = selectedModel.image && !selectedModel.image.includes('apple.png') && !selectedModel.image.includes('logo') && !selectedModel.image.endsWith('.svg');
              const displayImageSrc = isProductImage ? selectedModel.image : brandLogo;

              return (
                <div
                  style={{
                    background: '#111219',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    borderRadius: 18,
                    padding: '16px',
                    display: 'flex',
                    gap: 14,
                    boxShadow: '0 6px 24px rgba(0,0,0,0.4)',
                    position: 'relative',
                    alignItems: 'center'
                  }}
                >
                  {isProductImage ? (
                    <div
                      style={{
                        width: 72,
                        height: 90,
                        borderRadius: 12,
                        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, #08090d 80%)',
                        border: '1px solid rgba(212, 175, 55, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 4,
                        flexShrink: 0
                      }}
                    >
                      <img
                        src={displayImageSrc}
                        alt={selectedModel.name}
                        style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: 'transparent',
                        border: 'none',
                        padding: 0
                      }}
                    >
                      <img
                        src={displayImageSrc}
                        alt={brandObj?.name || selectedModel.name}
                        style={{
                          maxHeight: 46,
                          maxWidth: 46,
                          objectFit: 'contain',
                          background: 'transparent',
                          filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.2))'
                        }}
                      />
                    </div>
                  )}

                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      background: 'rgba(212, 175, 55, 0.15)',
                      color: 'var(--gold-light)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      borderRadius: 8,
                      padding: '2px 7px'
                    }}
                  >
                    {selectedModel.variantType}
                  </span>
                  {selectedColor && (
                    <span style={{ fontSize: 10, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span 
                        style={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          background: selectedColor.hex, 
                          border: '1px solid rgba(255,255,255,0.4)' 
                        }} 
                      />
                      {selectedColor.name}
                    </span>
                  )}
                  {selectedStorage && (
                    <span style={{ fontSize: 10, color: '#94a3b8' }}>
                      • {selectedStorage.size}
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', margin: '4px 0 2px' }}>
                  {selectedModel.name}
                </h3>

                <p style={{ fontSize: 11, color: '#94a3b8' }}>
                  Total Price: <strong style={{ color: '#ffffff' }}>PKR {calculatedTotalPrice.toLocaleString()}</strong>
                </p>

                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={handleConfigurePlan}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--gold-primary)',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: 0,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 3,
                      textDecoration: 'underline'
                    }}
                  >
                    <span>Change Plan / Storage / Color</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
            );
          })()}

            {/* Installment Scheme Summary Breakdown */}
            <div
              style={{
                background: '#0e0f15',
                border: '1.5px solid var(--gold-primary)',
                borderRadius: 18,
                padding: '16px',
                boxShadow: '0 6px 25px rgba(212, 175, 55, 0.15)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Selected Installment Scheme
                </span>
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    color: '#10b981',
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '2px 8px',
                    borderRadius: 10,
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}
                >
                  0% MARKUP
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div style={{ background: '#141620', padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 9, color: '#94a3b8', display: 'block' }}>Advance / Down Payment</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: 'var(--gold-light)' }}>
                    PKR {calculatedDownPayment.toLocaleString()}
                  </span>
                </div>

                <div style={{ background: '#141620', padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 9, color: '#94a3b8', display: 'block' }}>Monthly Installment</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: '#38bdf8' }}>
                    PKR {calculatedMonthlyEmi.toLocaleString()}/mo
                  </span>
                </div>

                <div style={{ background: '#141620', padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 9, color: '#94a3b8', display: 'block' }}>Installment Tenure</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
                    {selectedTenureMonths} Months Plan
                  </span>
                </div>

                <div style={{ background: '#141620', padding: '10px 12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontSize: 9, color: '#94a3b8', display: 'block' }}>Remaining Balance</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#ffffff' }}>
                    PKR {calculatedBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Supported Payment Channels */}
              <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: 10, marginTop: 10 }}>
                <span style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                  SUPPORTED ADVANCE PAYMENT CHANNELS:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {[
                    { name: 'Easypaisa', logo: '/easypaisa.webp' },
                    { name: 'Askari Bank', logo: '/askari.png' },
                    { name: 'Bank Alfalah', logo: '/alflah.png' },
                    { name: 'UPaisa', logo: '/upaisa-light.png' },
                    { name: 'Raqami', logo: '/raqami-logo-card.png' },
                    { name: 'Payway', logo: '/payway.png' },
                    { name: 'ABHI Financing', logo: '/abhi-light.png' }
                  ].map((c) => (
                    <span 
                      key={c.name}
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: '#cbd5e1',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.12)',
                        padding: '3px 7px',
                        borderRadius: 8,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5
                      }}
                    >
                      <span style={{ background: '#ffffff', borderRadius: 4, padding: '1px 4px', display: 'inline-flex', alignItems: 'center' }}>
                        <img src={c.logo} alt={c.name} style={{ height: 11, width: 'auto', objectFit: 'contain' }} />
                      </span>
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Trust Badges in Cart */}
            <div 
              style={{ 
                background: 'rgba(17, 18, 25, 0.6)', 
                border: '1px solid rgba(212, 175, 55, 0.2)', 
                borderRadius: 14, 
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: 8
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ShieldCheck size={16} color="var(--gold-primary)" />
                <span style={{ fontSize: 11, fontWeight: 800, color: '#ffffff' }}>
                  TCS Open Parcel Delivery
                </span>
              </div>
              <p style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.3 }}>
                Inspect your parcel, IMEI, box seal, and warranty card in front of the TCS courier rider before signing the delivery acceptance.
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <button
                type="button"
                className="big-gold-cta-btn"
                onClick={handleProceedToCheckout}
                style={{ width: '100%', maxWidth: 'none', height: 48 }}
              >
                <span>Proceed to Application &amp; Checkout</span>
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                className="btn-outline-back"
                onClick={handleBrowsePhones}
                style={{ textAlign: 'center', padding: '10px 14px' }}
              >
                <span>Select Another Phone</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
