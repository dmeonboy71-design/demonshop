'use client';

import React from 'react';
import { ChevronRight, ArrowLeft, Check, ShieldCheck, Sparkles } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import { EMI_TENURES, BRANDS } from '../../data/catalog';

export const Step2SelectPlan: React.FC = () => {
  const {
    selectedModel,
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
    goNext,
    goBack
  } = useWizard();

  if (!selectedModel) {
    return (
      <div className="wizard-content-area" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <p style={{ color: '#94a3b8' }}>Please select a phone model first.</p>
        <button type="button" onClick={goBack} className="btn-gold-action" style={{ marginTop: 14 }}>
          Go to Device Selection
        </button>
      </div>
    );
  }

  // Determine available tenures for this model (from PDF table: 12, 24, 36; and 42, 48 for 17 Pro Max / 18 Series)
  const availableTenureMonths = Object.keys(selectedModel.installments || {}).map(Number);
  const activeTenures = availableTenureMonths.length > 0 
    ? EMI_TENURES.filter((t) => availableTenureMonths.includes(t.months))
    : EMI_TENURES.slice(0, 3);

  return (
    <div className="wizard-content-area">
      <div className="step-header">
        <h2>Configure Installment Plan</h2>
        <p>Official 0% markup breakdown as documented in the Instalment Mobile Limited plan book.</p>
      </div>

      {/* Selected Model Card */}
      <div style={{
        background: '#111218',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '16px',
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        {(() => {
          const brandObj = BRANDS.find((b) => b.id === selectedModel.brandId);
          const brandLogo = brandObj?.logoUrl || '/apple-logo-white.png';
          const isProductImage = selectedModel.image && !selectedModel.image.includes('apple.png') && !selectedModel.image.includes('logo') && !selectedModel.image.endsWith('.svg');
          const displayImageSrc = isProductImage ? selectedModel.image : brandLogo;

          return isProductImage ? (
            <div style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(212,175,55,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img
                src={displayImageSrc}
                alt={selectedModel.name}
                style={{ width: 28, height: 28, objectFit: 'contain' }}
              />
            </div>
          ) : (
            <div style={{
              width: 44,
              height: 44,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              flexShrink: 0
            }}>
              <img
                src={displayImageSrc}
                alt={brandObj?.name || selectedModel.name}
                style={{
                  maxHeight: 36,
                  maxWidth: 36,
                  objectFit: 'contain',
                  background: 'transparent'
                }}
              />
            </div>
          );
        })()}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
              {selectedModel.name}
            </h4>
            <span className="variant-tag pta">
              {selectedModel.variantType}
            </span>
          </div>
          <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: 2 }}>
            Base Price: PKR {selectedModel.basePrice.toLocaleString('en-PK')}
          </p>
        </div>
      </div>

      {/* 1. Color Choice */}
      <div>
        <label className="form-label-dark">1. Select Titanium Finish / Color</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
          {selectedModel.colors.map((color) => {
            const isSelected = selectedColor?.name === color.name;
            return (
              <button
                key={color.name}
                type="button"
                onClick={() => setSelectedColor(color)}
                style={{
                  background: isSelected ? 'rgba(212, 175, 55, 0.15)' : '#111218',
                  border: `1px solid ${isSelected ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.2)'}`,
                  borderRadius: '12px',
                  padding: '10px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: isSelected ? 'var(--gold-light)' : '#cbd5e1',
                  fontSize: '11px',
                  fontWeight: 700
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: color.hex,
                    border: '1px solid rgba(255,255,255,0.4)',
                    flexShrink: 0
                  }}
                />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {color.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Storage Choice */}
      <div>
        <label className="form-label-dark">2. Select Storage Capacity</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {selectedModel.storageOptions.map((storage) => {
            const isSelected = selectedStorage?.size === storage.size;
            return (
              <button
                key={storage.size}
                type="button"
                onClick={() => setSelectedStorage(storage)}
                style={{
                  background: isSelected ? 'rgba(212, 175, 55, 0.15)' : '#111218',
                  border: `1px solid ${isSelected ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.2)'}`,
                  borderRadius: '12px',
                  padding: '10px 8px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  color: isSelected ? 'var(--gold-light)' : '#cbd5e1'
                }}
              >
                <div style={{ fontSize: '13px', fontWeight: 800 }}>{storage.size}</div>
                {storage.priceDelta > 0 && (
                  <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: 2 }}>
                    +PKR {storage.priceDelta.toLocaleString('en-PK')}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Tenure Selection (Official PDF Plan Options) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <label className="form-label-dark" style={{ margin: 0 }}>
            3. Choose Tenure
          </label>
          <span style={{ fontSize: '10px', color: 'var(--gold-primary)', fontWeight: 700 }}>
            0% MARKUP
          </span>
        </div>

        <div className="tenure-grid">
          {activeTenures.map((tenure) => {
            const isSelected = selectedTenureMonths === tenure.months;
            const emiVal = 
              selectedModel.installments?.[tenure.months] || 
              Math.round(calculatedBalance / tenure.months);

            return (
              <div
                key={tenure.months}
                className={`tenure-pill-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedTenureMonths(tenure.months)}
              >
                <div className="tenure-title">{tenure.months} Months</div>
                <div className="tenure-amount">
                  PKR {emiVal.toLocaleString('en-PK')}
                </div>
                <span style={{ fontSize: '9px', color: '#94a3b8', display: 'block', marginTop: 2 }}>
                  per month
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Official Plan Book Summary Card */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.12) 0%, rgba(19, 20, 27, 0.85) 100%)',
        border: '1.5px solid var(--gold-primary)',
        borderRadius: '18px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase' }}>
            Official Plan Summary
          </span>
          <span className="gold-pill-tag" style={{ margin: 0, padding: '2px 8px' }}>
            {selectedTenureMonths} Months Plan
          </span>
        </div>

        <div style={{ borderTop: '1px solid rgba(212, 175, 55, 0.2)', paddingTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Total Device Price</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
              PKR {calculatedTotalPrice.toLocaleString('en-PK')}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Initial Down Payment</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--gold-light)' }}>
              PKR {calculatedDownPayment.toLocaleString('en-PK')}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Remaining Balance</span>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
              PKR {calculatedBalance.toLocaleString('en-PK')}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Monthly Installment</span>
            <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--gold-light)' }}>
              PKR {calculatedMonthlyEmi.toLocaleString('en-PK')}
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#cbd5e1' }}>/mo</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky-bottom-bar">
        <button
          type="button"
          className="btn-outline-back"
          onClick={goBack}
        >
          <ArrowLeft size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
          Back
        </button>

        <button
          type="button"
          className="btn-gold-action"
          onClick={goNext}
        >
          <span>Customer &amp; Verification</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
