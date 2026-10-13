'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Copy, 
  Check, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Home, 
  FileText,
  Truck,
  Sparkles
} from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import { COMPANY_INFO } from '../../data/catalog';

interface Step5ConfirmationProps {
  onOpenLookup?: () => void;
}

export const Step5Confirmation: React.FC<Step5ConfirmationProps> = ({ onOpenLookup }) => {
  const { currentOrder, resetWizard } = useWizard();
  const [copied, setCopied] = useState<boolean>(false);

  if (!currentOrder) {
    return null;
  }

  const handleCopyOrderId = () => {
    if (typeof window !== 'undefined' && currentOrder?.orderId) {
      navigator.clipboard.writeText(currentOrder.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="wizard-content-area" style={{ textAlign: 'center' }}>
      {/* Success Badge */}
      <div style={{ margin: '14px 0', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '76px',
            height: '76px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, rgba(16, 185, 129, 0.15) 100%)',
            border: '2px solid var(--gold-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 24px rgba(212, 175, 55, 0.35)'
          }}
        >
          <CheckCircle2 size={46} color="#34d399" />
        </div>
      </div>

      <div className="gold-pill-tag" style={{ margin: '0 auto 10px' }}>
        <Sparkles size={12} style={{ marginRight: 4 }} />
        APPLICATION REGISTERED
      </div>

      <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', marginBottom: '6px' }}>
        Order Placed Successfully!
      </h2>
      <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '20px' }}>
        Thank you, <strong>{currentOrder.customer.fullName}</strong>. Your financing application with <strong>{COMPANY_INFO.name}</strong> has been received.
      </p>

      {/* Order ID Copy Box */}
      <div
        style={{
          background: '#0c0d12',
          border: '1.5px dashed var(--gold-primary)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
          Official Order ID
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--gold-light)', letterSpacing: '1px' }}>
            {currentOrder.orderId}
          </span>
          <button
            type="button"
            onClick={handleCopyOrderId}
            style={{
              background: copied ? '#10b981' : 'rgba(212, 175, 55, 0.15)',
              color: copied ? '#ffffff' : 'var(--gold-light)',
              border: '1px solid var(--gold-primary)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer'
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <p style={{ fontSize: '10px', color: '#64748b' }}>
          Keep this Order ID safe to track your verification &amp; shipment status.
        </p>
      </div>

      {/* Order Summary Details Card */}
      <div
        style={{
          background: '#111218',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '16px',
          padding: '16px',
          textAlign: 'left',
          marginBottom: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--gold-light)', textTransform: 'uppercase' }}>
          Application Summary
        </h4>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: '#94a3b8' }}>Device Selected:</span>
          <strong style={{ color: '#ffffff' }}>{currentOrder.model.name}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: '#94a3b8' }}>Color &amp; Storage:</span>
          <span style={{ color: '#ffffff' }}>{currentOrder.color.name} • {currentOrder.storage.size}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: '#94a3b8' }}>Tenure:</span>
          <span style={{ color: '#ffffff' }}>{currentOrder.months} Months (0% Markup)</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: '#94a3b8' }}>Monthly Installment:</span>
          <strong style={{ color: 'var(--gold-light)' }}>PKR {currentOrder.monthlyEmi.toLocaleString('en-PK')}/mo</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px' }}>
          <span style={{ color: '#94a3b8' }}>Down Payment:</span>
          <strong style={{ color: '#ffffff' }}>PKR {currentOrder.downPayment.toLocaleString('en-PK')}</strong>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: '#94a3b8' }}>Payment Channel:</span>
          <span style={{ color: '#ffffff', textTransform: 'capitalize' }}>{currentOrder.payment.channel}</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: '#94a3b8' }}>Delivery Mode:</span>
          <span style={{ color: '#10b981', fontWeight: 700 }}>
            {currentOrder.customer.deliveryType === 'open_parcel' ? 'Open Parcel TCS' : 'Insured Sealed'}
          </span>
        </div>
      </div>

      {/* Verification Next Steps Notice */}
      <div
        style={{
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '14px',
          padding: '14px',
          textAlign: 'left',
          marginBottom: '20px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', marginBottom: 6 }}>
          <ShieldCheck size={18} />
          <strong style={{ fontSize: '12px' }}>What Happens Next?</strong>
        </div>
        <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
          Our verification team will review your submitted CNIC and documents. You will receive an official verification call from our support helpline on your WhatsApp number.
        </p>
      </div>

      {/* Official Support Helplines from PDF */}
      <div style={{
        background: '#0c0d12',
        border: '1px solid rgba(212, 175, 55, 0.2)',
        borderRadius: '14px',
        padding: '12px',
        marginBottom: '20px'
      }}>
        <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Official Support Hotlines
        </span>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: 6, flexWrap: 'wrap' }}>
          <a
            href={`tel:${COMPANY_INFO.phone1}`}
            style={{ color: 'var(--gold-light)', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }}
          >
            📞 {COMPANY_INFO.phone1}
          </a>
          <a
            href={`tel:${COMPANY_INFO.phone2}`}
            style={{ color: 'var(--gold-light)', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }}
          >
            📞 {COMPANY_INFO.phone2}
          </a>
        </div>
      </div>

      {/* Home / Action Button */}
      <button
        type="button"
        className="big-gold-cta-btn"
        style={{ width: '100%' }}
        onClick={resetWizard}
      >
        <Home size={16} />
        <span>Return to Homepage</span>
      </button>
    </div>
  );
};
