'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, Clock, CheckCircle2, Truck, ShieldCheck, Phone, Mail } from 'lucide-react';
import { Header } from '../../components/Header';
import { useWizard } from '../../context/WizardContext';
import { COMPANY_INFO } from '../../data/catalog';

export default function TrackPage() {
  const { currentOrder } = useWizard();
  const [searchOrderId, setSearchOrderId] = useState('');
  const [searchPhone, setSearchPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundOrder, setFoundOrder] = useState<any>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);

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
        (searchPhone.trim() && searchPhone.trim() === currentOrder.customer.mobileNumber))
    ) {
      setFoundOrder(currentOrder);
    } else {
      setFoundOrder(null);
    }
  };

  return (
    <div className="main-wrapper">
      <Header />

      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <Link href="/" className="btn-outline-back" style={{ padding: '8px 14px' }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>Track Your Order</h1>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>
              Check real-time verification and TCS Open Parcel delivery status.
            </p>
          </div>
        </div>

        {/* Tracking Search Card */}
        <div
          style={{
            background: '#0f1016',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
            padding: '20px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
            marginBottom: '24px'
          }}
        >
          <form onSubmit={handleSearch} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label-dark">Order ID</label>
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder="IML-261013-4821"
                className="form-input-dark"
              />
            </div>

            <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
              — OR —
            </div>

            <div>
              <label className="form-label-dark">Customer Mobile Number</label>
              <input
                type="tel"
                value={searchPhone}
                onChange={(e) => setSearchPhone(e.target.value)}
                placeholder="03450951134"
                className="form-input-dark"
              />
            </div>

            <button
              type="submit"
              className="btn-gold-action"
              style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}
            >
              <Search size={16} />
              <span>Track Installment Status</span>
            </button>
          </form>
        </div>

        {/* Results */}
        {searched && (
          <div style={{ flex: 1 }}>
            {foundOrder ? (
              <div
                style={{
                  background: '#111218',
                  border: '1.5px solid var(--gold-primary)',
                  borderRadius: '20px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: 'var(--gold-light)' }}>
                    {foundOrder.orderId}
                  </span>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 800
                    }}
                  >
                    {foundOrder.status || 'Waiting for Approval'}
                  </span>
                </div>

                <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff' }}>
                  {foundOrder.model?.name}
                </div>

                <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {foundOrder.color?.name} • {foundOrder.storage?.size} • {foundOrder.months} Months Plan
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
                  <div>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Monthly Installment:</span>
                    <strong style={{ fontSize: '14px', color: 'var(--gold-light)', display: 'block' }}>
                      PKR {foundOrder.monthlyEmi?.toLocaleString('en-PK')}/mo
                    </strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Down Payment:</span>
                    <strong style={{ fontSize: '14px', color: '#ffffff', display: 'block' }}>
                      PKR {foundOrder.downPayment?.toLocaleString('en-PK')}
                    </strong>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', fontSize: '11px', color: '#94a3b8' }}>
                  Customer: <strong style={{ color: '#ffffff' }}>{foundOrder.customer?.fullName}</strong> ({foundOrder.customer?.mobileNumber})
                  <br />
                  Delivery Address: <span style={{ color: '#ffffff' }}>{foundOrder.customer?.deliveryAddress}</span>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '16px',
                  padding: '16px',
                  textAlign: 'center',
                  color: '#fca5a5',
                  fontSize: '13px'
                }}
              >
                No active order found with that ID or Phone number. If you recently placed an order, please allow 5-10 minutes or contact our support helpline.
              </div>
            )}
          </div>
        )}

        {/* Support Help Card */}
        <div
          style={{
            marginTop: 'auto',
            background: '#0c0d12',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center'
          }}
        >
          <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase' }}>
            Need Verification Assistance?
          </span>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: 8 }}>
            <a href={`tel:${COMPANY_INFO.phone1}`} style={{ color: 'var(--gold-light)', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }}>
              📞 {COMPANY_INFO.phone1}
            </a>
            <a href={`tel:${COMPANY_INFO.phone2}`} style={{ color: 'var(--gold-light)', fontSize: '12px', fontWeight: 800, textDecoration: 'none' }}>
              📞 {COMPANY_INFO.phone2}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
