'use client';

import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useWizard } from '../context/WizardContext';

const STEP_LABELS = [
  'Select Device',
  'Configure Plan',
  'Customer & Verification',
  'Payment & Agreement',
  'Confirmation'
];

export const Stepper: React.FC = () => {
  const { currentStep, goBack } = useWizard();

  if (currentStep === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 18px',
        background: '#0c0d12',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        gap: '12px'
      }}
    >
      {currentStep > 0 && currentStep < 5 ? (
        <button
          onClick={goBack}
          type="button"
          style={{
            background: 'rgba(212, 175, 55, 0.1)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            color: 'var(--gold-light)',
            width: '32px',
            height: '32px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
          title="Back to previous step"
        >
          <ArrowLeft size={16} />
        </button>
      ) : (
        <div style={{ width: '32px' }} />
      )}

      {/* 5 Step Pills */}
      <div style={{ display: 'flex', gap: '6px', flex: 1, maxWidth: '280px' }}>
        {[1, 2, 3, 4, 5].map((stepNum) => {
          const isCompleted = currentStep > stepNum;
          const isActive = currentStep === stepNum;
          return (
            <div
              key={stepNum}
              style={{
                height: '4px',
                flex: 1,
                borderRadius: '4px',
                background: isActive
                  ? 'var(--gold-metallic)'
                  : isCompleted
                  ? '#10b981'
                  : 'rgba(255, 255, 255, 0.1)',
                boxShadow: isActive ? '0 0 8px rgba(212, 175, 55, 0.5)' : 'none',
                transition: 'all 0.3s ease'
              }}
            />
          );
        })}
      </div>

      <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--gold-light)', whiteSpace: 'nowrap' }}>
        Step 0{currentStep}/05
      </div>
    </div>
  );
};
