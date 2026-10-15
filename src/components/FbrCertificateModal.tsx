'use client';

import React, { useEffect } from 'react';
import { ShieldCheck, X, Phone, ExternalLink, CheckCircle2, Building, Calendar, FileText } from 'lucide-react';

interface FbrCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FbrCertificateModal: React.FC<FbrCertificateModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fbr-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="fbr-modal-title"
    >
      <div 
        className="fbr-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="fbr-modal-header">
          <div className="fbr-modal-title-group">
            <div className="fbr-emblem-icon">
              <ShieldCheck size={20} color="#10b981" />
            </div>
            <div>
              <div className="fbr-header-gov">
                Government of Pakistan • Revenue Division
              </div>
              <h3 id="fbr-modal-title" className="fbr-header-title">
                Federal Board of Revenue (FBR) Verification
              </h3>
            </div>
          </div>

          <button 
            type="button" 
            className="fbr-close-btn"
            onClick={onClose}
            aria-label="Close Certificate Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Status Strip */}
        <div className="fbr-status-strip">
          <div className="fbr-status-badge">
            <span className="fbr-status-dot" />
            <span>Registration Status: <strong>Income Tax ACTIVE</strong></span>
          </div>
          <div className="fbr-sales-badge">
            <CheckCircle2 size={13} color="#10b981" />
            <span>Sales Tax Registered: <strong>Yes</strong></span>
          </div>
        </div>

        {/* Quick Information Summary Pills */}
        <div className="fbr-info-grid">
          <div className="fbr-info-item">
            <Building size={14} className="fbr-info-icon" />
            <div>
              <span className="fbr-info-label">Taxpayer Name</span>
              <strong className="fbr-info-val">Instalment Mobile Limited</strong>
            </div>
          </div>

          <div className="fbr-info-item">
            <FileText size={14} className="fbr-info-icon" />
            <div>
              <span className="fbr-info-label">Registration / NTN</span>
              <strong className="fbr-info-val">3220385204351</strong>
            </div>
          </div>

          <div className="fbr-info-item">
            <Calendar size={14} className="fbr-info-icon" />
            <div>
              <span className="fbr-info-label">Registered Since</span>
              <strong className="fbr-info-val">12-MAR-2022 (Active)</strong>
            </div>
          </div>

          <div className="fbr-info-item">
            <Phone size={14} className="fbr-info-icon" />
            <div>
              <span className="fbr-info-label">Official Registered Cell</span>
              <strong className="fbr-info-val">0345-0951134</strong>
            </div>
          </div>
        </div>

        {/* Certificate Image Frame */}
        <div className="fbr-cert-image-frame">
          <img 
            src="/fbr-taxpayer-certificate.png" 
            alt="FBR Taxpayer Profile Inquiry Certificate for Instalment Mobile Limited"
            className="fbr-cert-img"
          />
        </div>

        {/* Footer Actions */}
        <div className="fbr-modal-footer">
          <a 
            href="https://fbr.gov.pk" 
            target="_blank" 
            rel="noopener noreferrer"
            className="fbr-gov-link"
          >
            <span>Verify on Official FBR Portal</span>
            <ExternalLink size={12} />
          </a>

          <div className="fbr-footer-buttons">
            <a 
              href="tel:03450951134" 
              className="fbr-call-btn"
            >
              <Phone size={14} />
              <span>Call Helpline</span>
            </a>

            <button 
              type="button" 
              className="fbr-dismiss-btn"
              onClick={onClose}
            >
              Close Certificate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
