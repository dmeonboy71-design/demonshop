import type { Metadata } from 'next';
import './globals.css';
import { WizardProvider } from '../context/WizardContext';

export const metadata: Metadata = {
  title: 'Instalment Mobile Limited (IML) — Official iPhone Installment Plans',
  description: 'Official iPhone Installment Plans & Pricing Structure in Pakistan. 0% markup monthly installments on iPhone 18, 17, 16, 15, 14, 13 series. Supported channels: Easypaisa, Askari Bank, Bank Alfalah, UPaisa, Raqami Islamic Digital Bank, and Payway.',
  keywords: 'Instalment Mobile Limited, IML, iPhone installment Pakistan, iPhone 18 Pro Max installment, PTA approved iPhone, Non-PTA iPhone, Easypaisa, Askari Bank, Bank Alfalah, UPaisa, Raqami Islamic Digital Bank, Payway'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WizardProvider>
          {children}
        </WizardProvider>
      </body>
    </html>
  );
}
