'use client';

import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Stepper } from '../components/Stepper';
import { Step0Landing } from '../components/steps/Step0Landing';
import { Step1SelectMobile } from '../components/steps/Step1SelectMobile';
import { Step2SelectPlan } from '../components/steps/Step2SelectPlan';
import { Step3CustomerInfo } from '../components/steps/Step3CustomerInfo';
import { Step4PaymentAgreement } from '../components/steps/Step4PaymentAgreement';
import { Step5Confirmation } from '../components/steps/Step5Confirmation';
import { OrderLookupModal } from '../components/OrderLookupModal';
import { useWizard } from '../context/WizardContext';

export default function Home() {
  const { currentStep } = useWizard();
  const [isLookupOpen, setIsLookupOpen] = useState(false);

  return (
    <div className="main-wrapper">
      {/* Persistent Top Navbar with IML Branding */}
      <Header onOpenLookup={() => setIsLookupOpen(true)} />

      {/* Progress Stepper (Visible once wizard is past landing) */}
      <Stepper />

      {/* Dynamic View by Step */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentStep === 0 && <Step0Landing />}
        {currentStep === 1 && <Step1SelectMobile />}
        {currentStep === 2 && <Step2SelectPlan />}
        {currentStep === 3 && <Step3CustomerInfo />}
        {currentStep === 4 && <Step4PaymentAgreement />}
        {currentStep === 5 && <Step5Confirmation onOpenLookup={() => setIsLookupOpen(true)} />}
      </main>

      {/* Order Status Modal */}
      <OrderLookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
      />
    </div>
  );
}
