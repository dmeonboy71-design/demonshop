'use client';

import React from 'react';
import { Check, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import { BRANDS, SERIES, MobileModel } from '../../data/catalog';

export const Step1SelectMobile: React.FC = () => {
  const {
    modelsList,
    selectedBrandId,
    setSelectedBrandId,
    selectedSeriesId,
    setSelectedSeriesId,
    selectedModel,
    setSelectedModel,
    goNext
  } = useWizard();

  const availableSeries = SERIES.filter((s) => s.brandId === selectedBrandId);
  const availableModels = modelsList.filter((m) => m.seriesId === selectedSeriesId);

  const handleSelectAndProceed = (model: MobileModel) => {
    setSelectedModel(model);
    goNext();
  };

  return (
    <div className="wizard-content-area">
      <div className="step-header">
        <h2>Choose Your Device</h2>
        <p>Official PTA Approved, Non-PTA, and JV / Carrier iPhone models with transparent installment pricing.</p>
      </div>

      {/* 1. Brand Selection Horizontal Pills */}
      <div className="tabs-scroll-row">
        {BRANDS.map((brand) => {
          const isSelected = brand.id === selectedBrandId;
          return (
            <button
              key={brand.id}
              type="button"
              onClick={() => setSelectedBrandId(brand.id)}
              className={`series-tab-btn ${isSelected ? 'selected' : ''}`}
            >
              {brand.name}
            </button>
          );
        })}
      </div>

      {/* 2. Series Selection Tabs */}
      {availableSeries.length > 0 && (
        <div className="tabs-scroll-row" style={{ marginTop: -4 }}>
          {availableSeries.map((series) => {
            const isSelected = series.id === selectedSeriesId;
            return (
              <button
                key={series.id}
                type="button"
                onClick={() => setSelectedSeriesId(series.id)}
                className={`series-tab-btn ${isSelected ? 'selected' : ''}`}
                style={{ fontSize: '11px', padding: '6px 12px' }}
              >
                {series.name}
              </button>
            );
          })}
        </div>
      )}

      {/* 3. Models List with Exact PDF Pricing Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {availableModels.length > 0 ? (
          availableModels.map((model) => {
            const isSelected = selectedModel?.id === model.id;
            const variantClass = 
              model.variantType === 'PTA Approved' 
                ? 'pta' 
                : model.variantType === 'Non-PTA' 
                ? 'nonpta' 
                : 'jv';

            const downVal = model.downPayment ?? Math.round(model.basePrice * 0.3);
            const monthlyEstimate = 
              model.installments?.[12] || 
              Math.round((model.balance || (model.basePrice - downVal)) / 12);

            return (
              <div
                key={model.id}
                className={`model-card-dark ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedModel(model)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 50,
                      height: 50,
                      borderRadius: 12,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(212,175,55,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <img
                        src={model.image}
                        alt={model.name}
                        style={{ width: 28, height: 28, objectFit: 'contain' }}
                      />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>
                          {model.name}
                        </h3>
                        <span className={`variant-tag ${variantClass}`}>
                          {model.variantType}
                        </span>
                      </div>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: 2 }}>
                        {model.specs.slice(0, 2).join(' • ')}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAndProceed(model);
                    }}
                    className="btn-gold-action"
                    style={{ padding: '8px 14px', fontSize: '11px' }}
                  >
                    <span>Plan</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                {/* Pricing Structure as in PDF: Total, Down, Balance, EMI */}
                <div className="pricing-breakdown-box">
                  <div className="price-col">
                    <span>Total Price</span>
                    <strong>PKR {model.basePrice.toLocaleString('en-PK')}</strong>
                  </div>
                  <div className="price-col">
                    <span>Down Payment</span>
                    <strong>PKR {downVal.toLocaleString('en-PK')}</strong>
                  </div>
                  <div className="price-col highlight">
                    <span>From (12M)</span>
                    <strong>PKR {monthlyEstimate.toLocaleString('en-PK')}/mo</strong>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
            <p>No models available in this series.</p>
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      {selectedModel && (
        <div className="sticky-bottom-bar">
          <div>
            <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Selected Device</span>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
              {selectedModel.name}
            </div>
          </div>
          <button
            type="button"
            className="btn-gold-action"
            onClick={() => goNext()}
          >
            <span>Configure Plan</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
