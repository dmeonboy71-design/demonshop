'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Upload, 
  CheckCircle2, 
  ArrowLeft, 
  ChevronRight, 
  FileText, 
  AlertCircle 
} from 'lucide-react';
import { useWizard } from '../../context/WizardContext';
import { COMPANY_INFO } from '../../data/catalog';

export const Step3CustomerInfo: React.FC = () => {
  const { 
    customerDetails, 
    setCustomerDetails, 
    customerDocs, 
    setCustomerDocs, 
    goNext, 
    goBack, 
    syncRealtimeTelegram 
  } = useWizard();

  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleInputChange = (field: keyof typeof customerDetails, value: any) => {
    const updated = { ...customerDetails, [field]: value };
    setCustomerDetails(updated);
    if (typeof value === 'string' && value.length > 3) {
      syncRealtimeTelegram('Entering Customer Info');
    }
  };

  const handleDocUpload = (
    docNameKey: 'cnicFrontName' | 'cnicBackName' | 'utilityBillName' | 'balanceProofName' | 'familyCnicName',
    docFileKey: 'cnicFrontFile' | 'cnicBackFile' | 'utilityBillFile' | 'balanceProofFile' | 'familyCnicFile',
    file: File | null
  ) => {
    if (file) {
      setCustomerDocs((prev) => ({ 
        ...prev, 
        [docNameKey]: file.name,
        [docFileKey]: file 
      }));
    }
  };

  const handleNext = () => {
    if (!customerDetails.fullName.trim()) {
      setErrorMsg('Please enter your full name as printed on CNIC.');
      return;
    }
    if (!customerDetails.cnic.trim()) {
      setErrorMsg('Please provide your valid 13-digit CNIC number.');
      return;
    }
    if (!customerDetails.mobileNumber.trim()) {
      setErrorMsg('Please provide your primary active WhatsApp mobile number.');
      return;
    }
    if (!customerDetails.deliveryAddress.trim()) {
      setErrorMsg('Please enter your complete dispatch address for verification.');
      return;
    }

    setErrorMsg('');
    syncRealtimeTelegram('Submitted Customer Details & Verification Docs');
    goNext();
  };

  return (
    <div className="wizard-content-area">
      <div className="step-header">
        <h2>Customer &amp; Verification Details</h2>
        <p>Please enter your contact information and provide the required verification documents.</p>
      </div>

      {errorMsg && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid #ef4444',
          borderRadius: '12px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#fca5a5',
          fontSize: '12px'
        }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Basic Contact Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <label className="form-label-dark">1. Full Name (As per CNIC) *</label>
          <input
            type="text"
            className="form-input-dark"
            value={customerDetails.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="e.g. Muhammad Ali Shah"
          />
        </div>

        <div>
          <label className="form-label-dark">2. CNIC / ID Card Number *</label>
          <input
            type="text"
            inputMode="numeric"
            className="form-input-dark"
            value={customerDetails.cnic}
            onChange={(e) => handleInputChange('cnic', e.target.value)}
            placeholder="XXXXX-XXXXXXX-X (13 Digits)"
          />
        </div>

        <div>
          <label className="form-label-dark">3. Mobile Number (Active WhatsApp) *</label>
          <input
            type="tel"
            inputMode="numeric"
            className="form-input-dark"
            value={customerDetails.mobileNumber}
            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
            placeholder="0300 1234567"
          />
        </div>

        <div>
          <label className="form-label-dark">4. Delivery / Permanent Address *</label>
          <textarea
            rows={3}
            className="form-input-dark"
            value={customerDetails.deliveryAddress}
            onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
            placeholder="House #, Street, Block / Sector, City (e.g. Gulberg III, Lahore)"
          />
        </div>
      </div>

      {/* Official Required Documents Section (From PDF Page 14) */}
      <div style={{
        background: '#0c0d12',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '18px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', textTransform: 'uppercase' }}>
              Required Verification Documents
            </h4>
            <p style={{ fontSize: '10px', color: '#94a3b8' }}>
              Official verification checklist as per Instalment Mobile Limited policy
            </p>
          </div>
          <ShieldCheck size={20} color="#d4af37" />
        </div>

        {/* 01: CNIC Front & Back */}
        <div className="doc-upload-card">
          <div className="doc-info">
            <strong>01. CNIC / ID CARD (Front &amp; Back)</strong>
            <span>Customer&apos;s CNIC clear picture or scan copy.</span>
            {customerDocs.cnicFrontName && (
              <span style={{ color: 'var(--gold-light)', fontWeight: 700, marginTop: 4 }}>
                ✓ Attached: {customerDocs.cnicFrontName}
              </span>
            )}
          </div>
          <label className="doc-upload-btn">
            <Upload size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            {customerDocs.cnicFrontName ? 'Change' : 'Upload'}
            <input
              type="file"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleDocUpload('cnicFrontName', 'cnicFrontFile', e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* 02: Utility Bill */}
        <div className="doc-upload-card">
          <div className="doc-info">
            <strong>02. UTILITY BILL (Electricity / Gas / Water / PTCL)</strong>
            <span>Latest paid utility bill showing current residence address.</span>
            {customerDocs.utilityBillName && (
              <span style={{ color: 'var(--gold-light)', fontWeight: 700, marginTop: 4 }}>
                ✓ Attached: {customerDocs.utilityBillName}
              </span>
            )}
          </div>
          <label className="doc-upload-btn">
            <Upload size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            {customerDocs.utilityBillName ? 'Change' : 'Upload'}
            <input
              type="file"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleDocUpload('utilityBillName', 'utilityBillFile', e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* 03: Family Member CNIC */}
        <div className="doc-upload-card">
          <div className="doc-info">
            <strong>03. FAMILY MEMBER CNIC (Optional)</strong>
            <span>Provide family member CNIC if utility bill is in their name.</span>
            {customerDocs.familyCnicName && (
              <span style={{ color: 'var(--gold-light)', fontWeight: 700, marginTop: 4 }}>
                ✓ Attached: {customerDocs.familyCnicName}
              </span>
            )}
          </div>
          <label className="doc-upload-btn">
            <Upload size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            {customerDocs.familyCnicName ? 'Change' : 'Upload'}
            <input
              type="file"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleDocUpload('familyCnicName', 'familyCnicFile', e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* 04: Balance / Payment Proof */}
        <div className="doc-upload-card">
          <div className="doc-info">
            <strong>04. BALANCE / PAYMENT PROOF</strong>
            <span>Bank statement or wallet account balance screenshot.</span>
            {customerDocs.balanceProofName && (
              <span style={{ color: 'var(--gold-light)', fontWeight: 700, marginTop: 4 }}>
                ✓ Attached: {customerDocs.balanceProofName}
              </span>
            )}
          </div>
          <label className="doc-upload-btn">
            <Upload size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            {customerDocs.balanceProofName ? 'Change' : 'Upload'}
            <input
              type="file"
              accept="image/*,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleDocUpload('balanceProofName', 'balanceProofFile', e.target.files?.[0] || null)}
            />
          </label>
        </div>
      </div>

      {/* Delivery Protocol */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label className="form-label-dark">Delivery Verification Mode</label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          <div
            onClick={() => handleInputChange('deliveryType', 'open_parcel')}
            style={{
              background: customerDetails.deliveryType === 'open_parcel' ? 'rgba(212, 175, 55, 0.15)' : '#111218',
              border: `1px solid ${customerDetails.deliveryType === 'open_parcel' ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.2)'}`,
              borderRadius: '12px',
              padding: '12px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Truck size={16} color="var(--gold-light)" />
              <strong style={{ fontSize: '12px', color: '#ffffff' }}>Open Parcel TCS</strong>
            </div>
            <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: 4 }}>
              Inspect device physical condition before receiving.
            </p>
          </div>

          <div
            onClick={() => handleInputChange('deliveryType', 'standard')}
            style={{
              background: customerDetails.deliveryType === 'standard' ? 'rgba(212, 175, 55, 0.15)' : '#111218',
              border: `1px solid ${customerDetails.deliveryType === 'standard' ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.2)'}`,
              borderRadius: '12px',
              padding: '12px',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShieldCheck size={16} color="var(--gold-light)" />
              <strong style={{ fontSize: '12px', color: '#ffffff' }}>Insured Dispatch</strong>
            </div>
            <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: 4 }}>
              Sealed tamper-proof dispatch directly to your doorstep.
            </p>
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
          onClick={handleNext}
        >
          <span>Payment &amp; Down Payment</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
