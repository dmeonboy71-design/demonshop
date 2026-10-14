'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Home, 
  Smartphone, 
  Layers, 
  Users, 
  Mail, 
  Search, 
  Truck, 
  ShoppingCart
} from 'lucide-react';
import { useWizard } from '../context/WizardContext';
import { COMPANY_INFO } from '../data/catalog';

interface HeaderProps {
  onOpenLookup?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenLookup }) => {
  const { currentStep, setStep, selectedModel } = useWizard();

  return (
    <header className="iml-navbar">
      {/* Brand Enhanced Logo matching Image 1 & Image 2 */}
      <Link href="/" className="brand-badge" onClick={() => setStep(0)}>
        <img
          src="/logo.png"
          alt="IML"
          className="iml-nav-logo"
          style={{ height: '36px', width: '36px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div style={{ marginLeft: 8, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.4px', lineHeight: 1.15 }}>
            INSTALMENT
          </span>
          <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--gold-light)', letterSpacing: '0.3px', lineHeight: 1.1 }}>
            MOBILE LIMITED
          </span>
          <span style={{ fontSize: '6.5px', color: '#94a3b8', letterSpacing: '0.2px', textTransform: 'uppercase' }}>
            — YOUR TRUST, OUR PRIORITY —
          </span>
        </div>
      </Link>

      {/* Center Nav Links (Hidden on small mobile, visible on desktop/tablet) */}
      <nav className="nav-links-center">
        <button 
          type="button" 
          className={`nav-link-btn ${currentStep === 0 ? 'active' : ''}`}
          onClick={() => setStep(0)}
        >
          <Home size={14} />
          <span>Home</span>
        </button>

        <button 
          type="button" 
          className={`nav-link-btn ${currentStep === 1 ? 'active' : ''}`}
          onClick={() => setStep(1)}
        >
          <Smartphone size={14} />
          <span>Phones</span>
        </button>

        <button 
          type="button" 
          className={`nav-link-btn ${currentStep === 2 ? 'active' : ''}`}
          onClick={() => {
            if (selectedModel) setStep(2);
            else setStep(1);
          }}
        >
          <Layers size={14} />
          <span>Plans</span>
        </button>

        <a 
          href="#partners" 
          className="nav-link-btn"
          onClick={(e) => {
            if (currentStep !== 0) {
              e.preventDefault();
              setStep(0);
              setTimeout(() => {
                const el = document.getElementById('partners');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }}
        >
          <Users size={14} />
          <span>About</span>
        </a>

        <a 
          href={`tel:${COMPANY_INFO.phone1}`} 
          className="nav-link-btn"
          title={`Call Support: ${COMPANY_INFO.phone1}`}
        >
          <Mail size={14} />
          <span>Contact</span>
        </a>
      </nav>

      {/* Right Actions: Search, Track (White Truck Icon), Cart */}
      <div className="nav-actions-right">
        <button 
          type="button" 
          className="nav-icon-btn" 
          title="Search Phones"
          onClick={() => setStep(1)}
        >
          <Search size={15} />
        </button>

        <Link 
          href="/track" 
          className="nav-icon-btn track-nav-btn" 
          title="Track Your Order"
        >
          <Truck size={17} color="#ffffff" strokeWidth={2.2} />
        </Link>

        <Link 
          href="/cart" 
          className="nav-icon-btn cart-nav-btn" 
          title="Shopping Cart & Selected Plan"
        >
          <ShoppingCart size={15} />
          <span className="cart-count-badge">
            {selectedModel ? 1 : 0}
          </span>
        </Link>
      </div>
    </header>
  );
};
