'use client';

import React, { useState } from 'react';
import { Search, X, CheckCircle2, Clock, Truck, ShieldCheck } from 'lucide-react';
import { useWizard } from '../context/WizardContext';
import { COMPANY_INFO } from '../data/catalog';

interface OrderLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderLookupModal: React.FC<OrderLookupModalProps> = ({ isOpen, onClose }) => {
  const { currentOrder } = useWizard();
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<any>(null);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

    // First check local orders history
    try {
      const stored = JSON.parse(localStorage.getItem('iml_orders_history') || '[]');
      const match = stored.find(
        (o: any) =>
          (searchOrderId && o.orderId.toUpperCase() === searchOrderId.trim().toUpperCase()) ||
          (searchPhone && o.customer?.mobileNumber === searchPhone.trim())
      );
      if (match) {
        setFoundOrder(match);
        return;
      }
    } catch (e) {}

    if (
      currentOrder &&
      (searchOrderId.trim().toUpperCase() === currentOrder.orderId ||
        searchPhone.trim() === currentOrder.customer.mobileNumber)
    ) {
      setFoundOrder(currentOrder);
    } else {
      setFoundOrder(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(5, 5, 8, 0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          background: '#0f1016',
          border: '1.5px solid var(--gold-primary)',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '480px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        <button
          onClick={onClose}
          type="button"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#94a3b8'
          }}
        >
          <X size={18} />
        </button>

        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
          Track Your Installment Order
        </h3>
        <p style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '18px' }}>
          Enter your Order ID (e.g. IML-261013-1234) or registered Mobile Number.
        </p>

        <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
          <div>
            <label className="form-label-dark">Order ID</label>
            <input
              type="text"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              placeholder="e.g. IML-261013-4821"
              className="form-input-dark"
            />
          </div>

          <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
            — OR —
          </div>

          <div>
            <label className="form-label-dark">Mobile Number</label>
            <input
              type="tel"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              placeholder="e.g. 03450941134"
              className="form-input-dark"
            />
          </div>

          <button
            type="submit"
            className="btn-gold-action"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}
          >
            <Search size={16} />
            <span>Search Status</span>
          </button>
        </form>

        {/* Results */}
        {searched && (
          <div>
            {foundOrder ? (
              <div
                style={{
                  background: '#14151e',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: 'var(--gold-light)', fontWeight: 800 }}>
                    {foundOrder.orderId}
                  </span>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '3px 8px',
                      fontSize: '10px',
                      fontWeight: 800
                    }}
                  >
                    {foundOrder.status || 'Under Verification'}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                  {foundOrder.model?.name}
                </div>

                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  {foundOrder.color?.name} • {foundOrder.storage?.size} • {foundOrder.months} Months Plan
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: '#94a3b8' }}>Monthly EMI:</span>
                  <strong style={{ color: 'var(--gold-light)' }}>
                    PKR {foundOrder.monthlyEmi?.toLocaleString('en-PK')}/mo
                  </strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                  <span style={{ color: '#94a3b8' }}>Customer:</span>
                  <span style={{ color: '#ffffff' }}>{foundOrder.customer?.fullName}</span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  padding: '12px',
                  textAlign: 'center',
                  color: '#fca5a5',
                  fontSize: '12px'
                }}
              >
                No order found with the provided details. Please contact helpline: <strong>{COMPANY_INFO.phone1}</strong>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
