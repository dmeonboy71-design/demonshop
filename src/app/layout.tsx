import type { Metadata, Viewport } from 'next';
import './globals.css';
import { WizardProvider } from '../context/WizardContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Instalment Mobile Limited (IML) — Official iPhone Installment Plans',
  description: 'Official iPhone Installment Plans & Pricing Structure in Pakistan. 0% markup monthly installments on iPhone 18, 17, 16, 15, 14, 13 series. Supported channels: Easypaisa, Askari Bank, Bank Alfalah, UPaisa, Raqami Islamic Digital Bank, Payway, and ABHI Financing.',
  keywords: 'Instalment Mobile Limited, IML, iPhone installment Pakistan, iPhone 18 Pro Max installment, PTA approved iPhone, Non-PTA iPhone, Easypaisa, Askari Bank, Bank Alfalah, UPaisa, Raqami Islamic Digital Bank, Payway, ABHI Financing',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ]
  }
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
