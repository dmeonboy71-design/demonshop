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
  User, 
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
      {/* Brand Enhanced Logo from User */}
      <Link href="/" className="brand-badge" onClick={() => setStep(0)}>
        <img
          src="/iml-logo.png"
          alt="Instalment Mobile Limited — Your Trust, Our Priority"
          className="iml-nav-logo"
        />
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

      {/* Right Actions: Search, User/Track, Cart */}
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
          className="nav-icon-btn" 
          title="Track Your Order"
        >
          <User size={15} />
        </Link>

        <button 
          type="button" 
          className="nav-icon-btn" 
          title="Cart"
          onClick={() => {
            if (selectedModel) setStep(2);
            else setStep(1);
          }}
        >
          <ShoppingCart size={15} />
          <span className="cart-count-badge">
            {selectedModel ? 1 : 0}
          </span>
        </button>
      </div>
    </header>
  );
};
