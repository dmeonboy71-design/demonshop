'use client';

import React, { useState, useEffect } from 'react';
import { 
  Landmark, 
  CheckCircle2, 
  Check, 
  ArrowLeft, 
  Phone, 
  Image as ImageIcon, 
  UploadCloud, 
  Megaphone,
  AlertCircle,
  Lock,
  X
} from 'lucide-react';
import { useWizard, PaymentMethodChoice } from '../../context/WizardContext';
import { SUPPORTED_PAYMENT_CHANNELS, COMPANY_INFO } from '../../data/catalog';

export const Step4PaymentAgreement: React.FC = () => {
  const {
    selectedModel,
    selectedTenureMonths,
    calculatedDownPayment,
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
    const channelConf = SUPPORTED_PAYMENT_CHANNELS.find((c) => c.id === channelId) || SUPPORTED_PAYMENT_CHANNELS[0];
    const updated = {
      ...paymentDetails,
      channel: channelId,
      accountNumber: channelConf.accountNumber,
      accountTitle: channelConf.accountTitle
    };
    setPaymentDetails(updated);
    syncRealtimeTelegram(`Selected Payment Channel: ${channelId.toUpperCase()}`, updated);
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
        proofPreviewUrl: previewUrl,
        acceptedTerms: true
      });
      setErrorMsg('');
      syncRealtimeTelegram('Uploaded Down Payment Screenshot');
    }
  };

  const handleSubmitOrder = () => {
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
    <div style={{
      maxWidth: '560px',
      margin: '0 auto',
      padding: '10px 12px 100px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
      fontFamily: 'inherit'
    }}>
      {/* Down Payment Summary Bar */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(15, 16, 22, 0.95) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.4)',
        borderRadius: '14px',
        padding: '10px 14px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Required Down Payment
          </span>
          <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--gold-light)' }}>
            PKR {calculatedDownPayment.toLocaleString('en-PK')}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase' }}>
            Monthly EMI ({selectedTenureMonths}M)
          </span>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
            PKR {calculatedMonthlyEmi.toLocaleString('en-PK')}/mo
          </div>
        </div>
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

      {/* 3x3 Payment Method Grid (Exact Layout from Image 1) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px'
      }}>
        {SUPPORTED_PAYMENT_CHANNELS.map((chan) => {
          const isSelected = selectedChannel === chan.id;
          return (
            <div
              key={chan.id}
              onClick={() => handleChannelSelect(chan.id as PaymentMethodChoice)}
              style={{
                background: isSelected ? 'rgba(212, 175, 55, 0.14)' : '#0e1017',
                border: isSelected 
                  ? '1.5px solid #eab308' 
                  : '1px solid rgba(212, 175, 55, 0.22)',
                borderRadius: '16px',
                padding: '12px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                minHeight: '94px',
                boxShadow: isSelected 
                  ? '0 0 16px rgba(234, 179, 8, 0.35)' 
                  : '0 2px 6px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {/* Selected Gold Check Badge */}
              {isSelected && (
                <span style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 17,
                  height: 17,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.4)',
                  zIndex: 2
                }}>
                  <Check size={11} strokeWidth={3.5} />
                </span>
              )}

              {/* Special Badge for 'Other Bank' (number 9 in circle) */}
              {!isSelected && chan.badge && (
                <span style={{
                  position: 'absolute',
                  top: 7,
                  right: 7,
                  width: 17,
                  height: 17,
                  borderRadius: '50%',
                  background: '#f59e0b',
                  color: '#000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  fontWeight: 900,
                  zIndex: 2
                }}>
                  {chan.badge}
                </span>
              )}

              {/* Logo / Icon Area */}
              <div style={{
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 6
              }}>
                {chan.logo ? (
                  <img
                    src={chan.logo}
                    alt={chan.name}
                    style={{
                      maxHeight: chan.id === 'easypaisa' ? 26 : 28,
                      maxWidth: '85px',
                      objectFit: 'contain'
                    }}
                  />
                ) : (
                  <Landmark size={24} color="#f59e0b" />
                )}
              </div>

              {/* Title & Category */}
              <strong style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.15,
                marginBottom: 2
              }}>
                {chan.name}
              </strong>
              <span style={{
                fontSize: '8.5px',
                color: '#94a3b8',
                lineHeight: 1.1
              }}>
                {chan.category}
              </span>
            </div>
          );
        })}
      </div>

      {/* Official Transfer Details Section (Matching Image 1) */}
      <div style={{
        marginTop: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        {/* Header Strip */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 6
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Landmark size={18} color="#d4af37" />
            <span style={{
              fontSize: '13px',
              fontWeight: 900,
              color: '#d4af37',
              letterSpacing: '0.6px',
              textTransform: 'uppercase'
            }}>
              OFFICIAL TRANSFER DETAILS:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: 'rgba(255, 255, 255, 0.25)', fontSize: '13px' }}>|</span>
            <span style={{
              fontSize: '11px',
              color: '#10b981',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4
            }}>
              <CheckCircle2 size={14} color="#10b981" />
              Verified Merchant
            </span>
          </div>
        </div>

        {/* Selected Channel Badge Pill */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            border: '1.5px solid #d4af37',
            borderRadius: '24px',
            padding: '4px 14px',
            background: '#0c0e15'
          }}>
            {activeChannelConfig.logo ? (
              <img
                src={activeChannelConfig.logo}
                alt={activeChannelConfig.name}
                style={{ height: 18, width: 'auto', objectFit: 'contain' }}
              />
            ) : (
              <Landmark size={15} color="#d4af37" />
            )}
            <span style={{
              fontSize: '13px',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '0.2px'
            }}>
              {activeChannelConfig.name}
            </span>
          </div>
        </div>

        {/* Transfer Details Card */}
        <div style={{
          background: '#0a0c12',
          border: '1.5px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '14px',
          padding: '12px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Account Title:
            </span>
            <strong style={{ fontSize: '12px', color: '#ffffff', fontWeight: 800 }}>
              Company / Financing Partner / Company
            </strong>
          </div>

          <div style={{
            height: '1px',
            background: 'rgba(255, 255, 255, 0.08)',
            width: '100%'
          }} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Deposit Purpose:
            </span>
            <strong style={{ fontSize: '12px', color: '#ffffff', fontWeight: 800 }}>
              Verification for Down Payment
            </strong>
          </div>

          {activeChannelConfig.accountNumber && (
            <>
              <div style={{
                height: '1px',
                background: 'rgba(255, 255, 255, 0.08)',
                width: '100%'
              }} />
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Verification / Agent Code:
                </span>
                <strong style={{ fontSize: '13px', color: 'var(--gold-light)', fontWeight: 900, letterSpacing: '0.5px' }}>
                  03450951134
                </strong>
              </div>
            </>
          )}
        </div>
      </div>

      {/* "How to Attach Your Payment Proof before the Transaction?" Card (Golden Glow Box from Image 1) */}
      <div style={{
        background: '#0b0d14',
        border: '1.5px solid #d4af37',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.45)'
      }}>
        {/* Top Announcement Banner with warm golden gradient */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.28) 0%, rgba(180, 130, 8, 0.5) 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.35)',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#facc15',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}>
              <Megaphone size={19} color="#000000" />
            </div>
            <div>
              <div style={{
                fontSize: '12px',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.25
              }}>
                How to Attach Your Payment Proof before the Transaction?
              </div>
              <div style={{
                fontSize: '11px',
                fontWeight: 800,
                color: '#fbbf24',
                marginTop: 2
              }}>
                Contact Your Agent
              </div>
            </div>
          </div>

          {/* Call Agent Button */}
          <a
            href="tel:03450951134"
            style={{
              background: '#0d0f17',
              border: '1.5px solid #f59e0b',
              borderRadius: '24px',
              padding: '6px 14px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 900,
              textDecoration: 'none',
              letterSpacing: '0.5px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              marginLeft: 'auto'
            }}
          >
            <Phone size={13} color="#f59e0b" fill="#f59e0b" />
            <span>0345-0951134</span>
          </a>
        </div>

        {/* Bottom Upload Proof Action Area */}
        <div style={{
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          flexWrap: 'wrap'
        }}>
          {/* Left Text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ImageIcon size={20} color="#f59e0b" />
            </div>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff', lineHeight: 1.25 }}>
                Attach your before the transaction screenshot.
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: 2 }}>
                Verified by officer.
              </div>
            </div>
          </div>

          {/* Right Upload Button Box */}
          <label style={{
            border: paymentDetails.proofPreviewUrl 
              ? '1.5px solid #10b981' 
              : '1.5px dashed #d4af37',
            borderRadius: '12px',
            padding: '8px 14px',
            background: paymentDetails.proofPreviewUrl 
              ? 'rgba(16, 185, 129, 0.1)' 
              : 'rgba(212, 175, 55, 0.06)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginLeft: 'auto'
          }}>
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProofUpload}
            />
            {paymentDetails.proofPreviewUrl ? (
              <>
                <img
                  src={paymentDetails.proofPreviewUrl}
                  alt="Proof"
                  style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#10b981' }}>
                    Screenshot Attached ✓
                  </div>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                    Click to replace
                  </div>
                </div>
              </>
            ) : (
              <>
                <UploadCloud size={20} color="#d4af37" />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#ffffff' }}>
                    Upload Payment Proof
                  </div>
                  <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                    (Screenshot)
                  </div>
                </div>
              </>
            )}
          </label>
        </div>
      </div>

      {/* OTP Modal (if needed) */}
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

      {/* Sticky Bottom Actions Bar (Exact Design from Image 1) */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(10, 11, 16, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        padding: '12px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '560px',
          width: '100%',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12
        }}>
          {/* Back Button */}
          <button
            type="button"
            onClick={goBack}
            style={{
              background: '#000000',
              border: '1.5px solid rgba(255, 255, 255, 0.35)',
              borderRadius: '24px',
              padding: '10px 22px',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.2s'
            }}
          >
            <ArrowLeft size={15} />
            <span>Back</span>
          </button>

          {/* Confirm & Place Order Button */}
          <button
            type="button"
            onClick={handleSubmitOrder}
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d4af37 100%)',
              border: 'none',
              borderRadius: '24px',
              padding: '11px 26px',
              color: '#000000',
              fontSize: '13px',
              fontWeight: 900,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 4px 16px rgba(245, 158, 11, 0.35)',
              transition: 'all 0.2s'
            }}
          >
            <Check size={16} strokeWidth={3} />
            <span>Confirm &amp; Place Order</span>
          </button>
        </div>
      </div>
    </div>
  );
};
