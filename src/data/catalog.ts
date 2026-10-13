export interface BrandOption {
  id: string;
  name: string;
  logoUrl: string;
}

export interface SeriesOption {
  id: string;
  brandId: string;
  name: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}

export interface StorageOption {
  size: string;
  priceDelta: number;
}

export interface InstallmentPlanBreakdown {
  [months: number]: number; // monthly installment amount
}

export interface MobileModel {
  id: string;
  brandId: string;
  seriesId: string;
  name: string;
  variantType?: 'PTA Approved' | 'Non-PTA' | 'JV / Carrier';
  basePrice: number;       // Total Price in PKR
  downPayment?: number;     // Down Payment in PKR
  balance?: number;         // Balance remaining
  installments?: InstallmentPlanBreakdown;
  image: string;
  specs: string[];
  colors: ColorOption[];
  storageOptions: StorageOption[];
}

export interface BankOption {
  id: string;
  name: string;
  code: string;
  logo?: string;
  accountNumber?: string;
  accountTitle?: string;
}

export interface WalletOption {
  id: string;
  name: string;
  tagline: string;
  accountNumber: string;
  accountTitle: string;
  fee: string;
  logo?: string;
}

export const BRANDS: BrandOption[] = [
  { id: 'apple', name: 'Apple iPhone', logoUrl: '/apple-logo-white.png' },
  { id: 'samsung', name: 'Samsung', logoUrl: '/samsung.svg' },
  { id: 'google', name: 'Google Pixel', logoUrl: '/google-pixel.webp' },
  { id: 'oneplus', name: 'OnePlus', logoUrl: '/oneplus.png' },
  { id: 'xiaomi', name: 'Xiaomi', logoUrl: '/xiomi.png' },
  { id: 'vivo', name: 'Vivo', logoUrl: '/vivo.png' },
  { id: 'oppo', name: 'Oppo', logoUrl: '/oppo.svg' },
  { id: 'realme', name: 'Realme', logoUrl: '/realme.webp' },
  { id: 'infinix', name: 'Infinix', logoUrl: '/infinix-logo.webp' },
  { id: 'tecno', name: 'Tecno', logoUrl: '/techno.webp' },
  { id: 'nothing', name: 'Nothing Phone', logoUrl: '/nothing-logo.webp' }
];

export const SERIES: SeriesOption[] = [
  // Apple iPhone Official Series as in PDF Book
  { id: 'apple-18', brandId: 'apple', name: 'iPhone 18 Series (Latest)' },
  { id: 'apple-17', brandId: 'apple', name: 'iPhone 17 Series' },
  { id: 'apple-16', brandId: 'apple', name: 'iPhone 16 Series' },
  { id: 'apple-15', brandId: 'apple', name: 'iPhone 15 Series' },
  { id: 'apple-14', brandId: 'apple', name: 'iPhone 14 Series' },
  { id: 'apple-13', brandId: 'apple', name: 'iPhone 13 Series' },

  // Other Brands
  { id: 'samsung-s', brandId: 'samsung', name: 'Galaxy S Series' },
  { id: 'samsung-z', brandId: 'samsung', name: 'Galaxy Z Fold / Flip' },
  { id: 'samsung-a', brandId: 'samsung', name: 'Galaxy A Series' },
  { id: 'google-pixel', brandId: 'google', name: 'Google Pixel Flagships' },
  { id: 'oneplus-main', brandId: 'oneplus', name: 'OnePlus Flagship' },
  { id: 'xiaomi-main', brandId: 'xiaomi', name: 'Xiaomi & Poco' },
  { id: 'vivo-main', brandId: 'vivo', name: 'Vivo V & X Series' }
];

export const IPHONE_COLORS: ColorOption[] = [
  { name: 'Titanium Black', hex: '#1c1c1e' },
  { name: 'Titanium White', hex: '#f2f2f7' },
  { name: 'Titanium Gold', hex: '#d4af37' },
  { name: 'Titanium Blue', hex: '#3b5368' },
  { name: 'Titanium Orange', hex: '#c68b59' }
];

export const IPHONE_STORAGE: StorageOption[] = [
  { size: '256GB', priceDelta: 0 },
  { size: '512GB', priceDelta: 25000 },
  { size: '1TB', priceDelta: 55000 }
];

export const INITIAL_MODELS: MobileModel[] = [
  // ========================================================
  // iPhone 18 Series (PDF Pages 12 & 13)
  // ========================================================
  {
    id: 'ip-18pm-pta',
    brandId: 'apple',
    seriesId: 'apple-18',
    name: 'iPhone 18 Pro Max PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 650000,
    downPayment: 195000,
    balance: 455000,
    installments: { 12: 37917, 24: 18958, 36: 12639, 42: 10833 },
    image: '/apple.png',
    specs: ['Apple A20 Pro Chip', '48MP ProRAW Triple Cam', '6.9" Super Retina XDR Display', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-18pm-nonpta',
    brandId: 'apple',
    seriesId: 'apple-18',
    name: 'iPhone 18 Pro Max Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 460000,
    downPayment: 138000,
    balance: 322000,
    installments: { 12: 26833, 24: 13417, 36: 8944, 42: 7667 },
    image: '/apple.png',
    specs: ['Apple A20 Pro Chip', '48MP ProRAW Triple Cam', '6.9" Super Retina XDR Display', 'Factory Unlocked Non-PTA'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-18pm-jv',
    brandId: 'apple',
    seriesId: 'apple-18',
    name: 'iPhone 18 Pro Max JV / Carrier',
    variantType: 'JV / Carrier',
    basePrice: 360000,
    downPayment: 108000,
    balance: 252000,
    installments: { 12: 21000, 24: 10500, 36: 7000, 42: 6000 },
    image: '/apple.png',
    specs: ['Apple A20 Pro Chip', '48MP ProRAW Triple Cam', '6.9" Super Retina XDR Display', 'Carrier JV Model'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-18p-pta',
    brandId: 'apple',
    seriesId: 'apple-18',
    name: 'iPhone 18 Pro PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 580000,
    downPayment: 174000,
    balance: 406000,
    installments: { 12: 33833, 24: 16917, 36: 11278, 42: 9667 },
    image: '/apple.png',
    specs: ['Apple A20 Pro Chip', '48MP ProRAW Triple Cam', '6.3" ProMotion 120Hz', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-18p-nonpta',
    brandId: 'apple',
    seriesId: 'apple-18',
    name: 'iPhone 18 Pro Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 354550,
    downPayment: 106365,
    balance: 248185,
    installments: { 12: 20682, 24: 10341, 36: 6894, 42: 5909 },
    image: '/apple.png',
    specs: ['Apple A20 Pro Chip', '48MP ProRAW Triple Cam', '6.3" ProMotion 120Hz', 'Factory Unlocked Non-PTA'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },

  // ========================================================
  // iPhone 17 Series (PDF Pages 10 & 11)
  // ========================================================
  {
    id: 'ip-17pm-pta',
    brandId: 'apple',
    seriesId: 'apple-17',
    name: 'iPhone 17 Pro Max PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 480000,
    downPayment: 144000,
    balance: 336000,
    installments: { 12: 28000, 24: 14000, 36: 9333, 42: 8000, 48: 7000 },
    image: '/apple.png',
    specs: ['Apple A19 Pro Chip', 'Periscope 5x Telephoto', '6.9" ProMotion OLED', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-17pm-nonpta',
    brandId: 'apple',
    seriesId: 'apple-17',
    name: 'iPhone 17 Pro Max Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 340000,
    downPayment: 102000,
    balance: 238000,
    installments: { 12: 19833, 24: 9917, 36: 6611, 42: 5667, 48: 4958 },
    image: '/apple.png',
    specs: ['Apple A19 Pro Chip', 'Periscope 5x Telephoto', '6.9" ProMotion OLED', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-17pm-jv',
    brandId: 'apple',
    seriesId: 'apple-17',
    name: 'iPhone 17 Pro Max JV / Carrier',
    variantType: 'JV / Carrier',
    basePrice: 280000,
    downPayment: 84000,
    balance: 196000,
    installments: { 12: 16333, 24: 8167, 36: 5444, 42: 4667, 48: 4083 },
    image: '/apple.png',
    specs: ['Apple A19 Pro Chip', 'Periscope 5x Telephoto', '6.9" ProMotion OLED', 'Carrier JV Model'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-17p-pta',
    brandId: 'apple',
    seriesId: 'apple-17',
    name: 'iPhone 17 Pro PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 300000,
    downPayment: 50000,
    balance: 250000,
    installments: { 12: 20833, 24: 10417, 36: 6944 },
    image: '/apple.png',
    specs: ['Apple A19 Pro Chip', 'Triple 48MP System', '6.3" ProMotion', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-17p-nonpta',
    brandId: 'apple',
    seriesId: 'apple-17',
    name: 'iPhone 17 Pro Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 260000,
    downPayment: 50000,
    balance: 210000,
    installments: { 12: 17500, 24: 8750, 36: 5833 },
    image: '/apple.png',
    specs: ['Apple A19 Pro Chip', 'Triple 48MP System', '6.3" ProMotion', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-17-pta',
    brandId: 'apple',
    seriesId: 'apple-17',
    name: 'iPhone 17 PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 260000,
    downPayment: 45000,
    balance: 215000,
    installments: { 12: 17917, 24: 8958, 36: 5972 },
    image: '/apple.png',
    specs: ['Apple A19 Bionic', 'Dual Camera 48MP', 'Dynamic Island', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-17-nonpta',
    brandId: 'apple',
    seriesId: 'apple-17',
    name: 'iPhone 17 Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 190000,
    downPayment: 50000,
    balance: 140000,
    installments: { 12: 11667, 24: 5833, 36: 3889 },
    image: '/apple.png',
    specs: ['Apple A19 Bionic', 'Dual Camera 48MP', 'Dynamic Island', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },

  // ========================================================
  // iPhone 16 Series (PDF Pages 8 & 9)
  // ========================================================
  {
    id: 'ip-16pm-pta',
    brandId: 'apple',
    seriesId: 'apple-16',
    name: 'iPhone 16 Pro Max PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 380000,
    downPayment: 50000,
    balance: 330000,
    installments: { 12: 27500, 24: 13750, 36: 9167 },
    image: '/apple.png',
    specs: ['Apple A18 Pro Chip', 'Camera Control Button', '6.9" ProMotion OLED', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-16pm-nonpta',
    brandId: 'apple',
    seriesId: 'apple-16',
    name: 'iPhone 16 Pro Max Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 260000,
    downPayment: 50000,
    balance: 210000,
    installments: { 12: 17500, 24: 8750, 36: 5833 },
    image: '/apple.png',
    specs: ['Apple A18 Pro Chip', 'Camera Control Button', '6.9" ProMotion OLED', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-16pm-jv',
    brandId: 'apple',
    seriesId: 'apple-16',
    name: 'iPhone 16 Pro Max JV / Carrier',
    variantType: 'JV / Carrier',
    basePrice: 220000,
    downPayment: 50000,
    balance: 170000,
    installments: { 12: 14167, 24: 7083, 36: 4722 },
    image: '/apple.png',
    specs: ['Apple A18 Pro Chip', 'Camera Control Button', '6.9" ProMotion OLED', 'Carrier JV Model'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-16p-pta',
    brandId: 'apple',
    seriesId: 'apple-16',
    name: 'iPhone 16 Pro PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 240000,
    downPayment: 50000,
    balance: 190000,
    installments: { 12: 16667, 24: 8333, 36: 5556 },
    image: '/apple.png',
    specs: ['Apple A18 Pro Chip', 'Titanium Frame', '6.3" 120Hz ProMotion', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-16p-nonpta',
    brandId: 'apple',
    seriesId: 'apple-16',
    name: 'iPhone 16 Pro Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 180000,
    downPayment: 50000,
    balance: 130000,
    installments: { 12: 11667, 24: 5833, 36: 3889 },
    image: '/apple.png',
    specs: ['Apple A18 Pro Chip', 'Titanium Frame', '6.3" 120Hz ProMotion', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-16-pta',
    brandId: 'apple',
    seriesId: 'apple-16',
    name: 'iPhone 16 PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 200000,
    downPayment: 45000,
    balance: 155000,
    installments: { 12: 12917, 24: 6458, 36: 4292 },
    image: '/apple.png',
    specs: ['Apple A18 Bionic', 'Apple Intelligence Ready', 'Action Button', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-16-nonpta',
    brandId: 'apple',
    seriesId: 'apple-16',
    name: 'iPhone 16 Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 160000,
    downPayment: 40000,
    balance: 120000,
    installments: { 12: 10000, 24: 5000, 36: 3333 },
    image: '/apple.png',
    specs: ['Apple A18 Bionic', 'Apple Intelligence Ready', 'Action Button', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },

  // ========================================================
  // iPhone 15 Series (PDF Pages 6 & 7)
  // ========================================================
  {
    id: 'ip-15pm-pta',
    brandId: 'apple',
    seriesId: 'apple-15',
    name: 'iPhone 15 Pro Max PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 320000,
    downPayment: 50000,
    balance: 270000,
    installments: { 12: 22500, 24: 11250, 36: 7500 },
    image: '/apple.png',
    specs: ['Apple A17 Pro 3nm', '5x Telephoto Zoom', 'Grade 5 Titanium', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-15pm-nonpta',
    brandId: 'apple',
    seriesId: 'apple-15',
    name: 'iPhone 15 Pro Max Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 220000,
    downPayment: 50000,
    balance: 170000,
    installments: { 12: 14167, 24: 7083, 36: 4722 },
    image: '/apple.png',
    specs: ['Apple A17 Pro 3nm', '5x Telephoto Zoom', 'Grade 5 Titanium', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-15pm-jv',
    brandId: 'apple',
    seriesId: 'apple-15',
    name: 'iPhone 15 Pro Max JV / Carrier',
    variantType: 'JV / Carrier',
    basePrice: 180000,
    downPayment: 50000,
    balance: 130000,
    installments: { 12: 11667, 24: 5833, 36: 3889 },
    image: '/apple.png',
    specs: ['Apple A17 Pro 3nm', '5x Telephoto Zoom', 'Grade 5 Titanium', 'Carrier JV Model'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-15p-pta',
    brandId: 'apple',
    seriesId: 'apple-15',
    name: 'iPhone 15 Pro PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 220000,
    downPayment: 50000,
    balance: 170000,
    installments: { 12: 14167, 24: 7083, 36: 4722 },
    image: '/apple.png',
    specs: ['Apple A17 Pro 3nm', 'Titanium Design', 'Action Button', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-15p-nonpta',
    brandId: 'apple',
    seriesId: 'apple-15',
    name: 'iPhone 15 Pro Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 160000,
    downPayment: 50000,
    balance: 110000,
    installments: { 12: 9167, 24: 4583, 36: 3056 },
    image: '/apple.png',
    specs: ['Apple A17 Pro 3nm', 'Titanium Design', 'Action Button', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-15-pta',
    brandId: 'apple',
    seriesId: 'apple-15',
    name: 'iPhone 15 PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 180000,
    downPayment: 45000,
    balance: 135000,
    installments: { 12: 11250, 24: 5625, 36: 3750 },
    image: '/apple.png',
    specs: ['Apple A16 Bionic', 'Dynamic Island', '48MP Main Camera', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-15-nonpta',
    brandId: 'apple',
    seriesId: 'apple-15',
    name: 'iPhone 15 Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 130000,
    downPayment: 40000,
    balance: 90000,
    installments: { 12: 7500, 24: 3750, 36: 2500 },
    image: '/apple.png',
    specs: ['Apple A16 Bionic', 'Dynamic Island', '48MP Main Camera', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },

  // ========================================================
  // iPhone 14 Series (PDF Pages 4 & 5)
  // ========================================================
  {
    id: 'ip-14pm-pta',
    brandId: 'apple',
    seriesId: 'apple-14',
    name: 'iPhone 14 Pro Max PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 240000,
    downPayment: 50000,
    balance: 190000,
    installments: { 12: 16667, 24: 8333, 36: 5556 },
    image: '/apple.png',
    specs: ['Apple A16 Bionic', 'Dynamic Island Pioneer', '48MP Pro Quad Pixel', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-14pm-nonpta',
    brandId: 'apple',
    seriesId: 'apple-14',
    name: 'iPhone 14 Pro Max Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 180000,
    downPayment: 50000,
    balance: 130000,
    installments: { 12: 11667, 24: 5833, 36: 3889 },
    image: '/apple.png',
    specs: ['Apple A16 Bionic', 'Dynamic Island Pioneer', '48MP Pro Quad Pixel', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-14pm-jv',
    brandId: 'apple',
    seriesId: 'apple-14',
    name: 'iPhone 14 Pro Max JV / Carrier',
    variantType: 'JV / Carrier',
    basePrice: 150000,
    downPayment: 50000,
    balance: 100000,
    installments: { 12: 8333, 24: 4167, 36: 2778 },
    image: '/apple.png',
    specs: ['Apple A16 Bionic', 'Dynamic Island Pioneer', '48MP Pro Quad Pixel', 'Carrier JV Model'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-14p-pta',
    brandId: 'apple',
    seriesId: 'apple-14',
    name: 'iPhone 14 Pro PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 170000,
    downPayment: 50000,
    balance: 120000,
    installments: { 12: 10000, 24: 5000, 36: 3333 },
    image: '/apple.png',
    specs: ['Apple A16 Bionic', 'Always-On Display', '48MP Main Cam', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-14p-nonpta',
    brandId: 'apple',
    seriesId: 'apple-14',
    name: 'iPhone 14 Pro Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 120000,
    downPayment: 40000,
    balance: 80000,
    installments: { 12: 6667, 24: 3333, 36: 2222 },
    image: '/apple.png',
    specs: ['Apple A16 Bionic', 'Always-On Display', '48MP Main Cam', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-14-pta',
    brandId: 'apple',
    seriesId: 'apple-14',
    name: 'iPhone 14 PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 155000,
    downPayment: 35000,
    balance: 120000,
    installments: { 12: 10000, 24: 5000, 36: 3333 },
    image: '/apple.png',
    specs: ['Apple A15 Bionic 5-Core GPU', 'Action Mode Video', 'Photonic Engine', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-14-nonpta',
    brandId: 'apple',
    seriesId: 'apple-14',
    name: 'iPhone 14 Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 100000,
    downPayment: 40000,
    balance: 60000,
    installments: { 12: 5000, 24: 2500, 36: 1667 },
    image: '/apple.png',
    specs: ['Apple A15 Bionic 5-Core GPU', 'Action Mode Video', 'Photonic Engine', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },

  // ========================================================
  // iPhone 13 Series (PDF Pages 2 & 3)
  // ========================================================
  {
    id: 'ip-13pm-pta',
    brandId: 'apple',
    seriesId: 'apple-13',
    name: 'iPhone 13 Pro Max PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 200000,
    downPayment: 50000,
    balance: 150000,
    installments: { 12: 12500, 24: 6250, 36: 4170 },
    image: '/apple.png',
    specs: ['Apple A15 Bionic', 'ProMotion 120Hz', 'Cinematic Mode', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-13pm-nonpta',
    brandId: 'apple',
    seriesId: 'apple-13',
    name: 'iPhone 13 Pro Max Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 140000,
    downPayment: 50000,
    balance: 90000,
    installments: { 12: 7500, 24: 3750, 36: 2500 },
    image: '/apple.png',
    specs: ['Apple A15 Bionic', 'ProMotion 120Hz', 'Cinematic Mode', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-13pm-jv',
    brandId: 'apple',
    seriesId: 'apple-13',
    name: 'iPhone 13 Pro Max JV / Carrier',
    variantType: 'JV / Carrier',
    basePrice: 120000,
    downPayment: 50000,
    balance: 70000,
    installments: { 12: 5835, 24: 2920, 36: 1945 },
    image: '/apple.png',
    specs: ['Apple A15 Bionic', 'ProMotion 120Hz', 'Cinematic Mode', 'Carrier JV Model'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-13p-pta',
    brandId: 'apple',
    seriesId: 'apple-13',
    name: 'iPhone 13 Pro PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 125000,
    downPayment: 30000,
    balance: 95000,
    installments: { 12: 7920, 24: 3960, 36: 2640 },
    image: '/apple.png',
    specs: ['Apple A15 Bionic', 'Macro Photography', 'Stainless Steel', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-13p-nonpta',
    brandId: 'apple',
    seriesId: 'apple-13',
    name: 'iPhone 13 Pro Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 90000,
    downPayment: 25000,
    balance: 65000,
    installments: { 12: 5420, 24: 2710, 36: 1805 },
    image: '/apple.png',
    specs: ['Apple A15 Bionic', 'Macro Photography', 'Stainless Steel', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-13-pta',
    brandId: 'apple',
    seriesId: 'apple-13',
    name: 'iPhone 13 PTA Approved',
    variantType: 'PTA Approved',
    basePrice: 100000,
    downPayment: 30000,
    balance: 70000,
    installments: { 12: 5835, 24: 2920, 36: 1945 },
    image: '/apple.png',
    specs: ['Apple A15 Bionic', 'Diagonal Dual Cameras', 'Super Retina XDR', 'PTA Approved Official'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },
  {
    id: 'ip-13-nonpta',
    brandId: 'apple',
    seriesId: 'apple-13',
    name: 'iPhone 13 Non-PTA',
    variantType: 'Non-PTA',
    basePrice: 70000,
    downPayment: 20000,
    balance: 50000,
    installments: { 12: 4170, 24: 2085, 36: 1390 },
    image: '/apple.png',
    specs: ['Apple A15 Bionic', 'Diagonal Dual Cameras', 'Super Retina XDR', 'Non-PTA Unlocked'],
    colors: IPHONE_COLORS,
    storageOptions: IPHONE_STORAGE
  },

  // ========================================================
  // Samsung Flagships (Complementary catalog)
  // ========================================================
  {
    id: 'sam-s25u',
    brandId: 'samsung',
    seriesId: 'samsung-s',
    name: 'Samsung Galaxy S25 Ultra 12/512GB',
    variantType: 'PTA Approved',
    basePrice: 355000,
    downPayment: 90000,
    balance: 265000,
    installments: { 12: 22083, 24: 11042, 36: 7361 },
    image: '/samsung.svg',
    specs: ['Snapdragon 8 Elite', '200MP Camera + S-Pen', 'Titanium Build', 'Galaxy AI'],
    colors: [
      { name: 'Titanium Gray', hex: '#6b7280' },
      { name: 'Titanium Black', hex: '#111827' }
    ],
    storageOptions: [{ size: '512GB', priceDelta: 0 }]
  },
  {
    id: 'sam-s24u',
    brandId: 'samsung',
    seriesId: 'samsung-s',
    name: 'Samsung Galaxy S24 Ultra 12/256GB',
    variantType: 'PTA Approved',
    basePrice: 285000,
    downPayment: 75000,
    balance: 210000,
    installments: { 12: 17500, 24: 8750, 36: 5833 },
    image: '/samsung.svg',
    specs: ['Snapdragon 8 Gen 3', '200MP AI Camera', 'Flat AMOLED Display', 'Galaxy AI'],
    colors: [
      { name: 'Titanium Gray', hex: '#6b7280' },
      { name: 'Titanium Black', hex: '#111827' }
    ],
    storageOptions: [{ size: '256GB', priceDelta: 0 }]
  }
];

export const MODELS: MobileModel[] = INITIAL_MODELS;

export const EMI_TENURES = [
  { months: 12, label: '12 Months (1 Year)' },
  { months: 24, label: '24 Months (2 Years)' },
  { months: 36, label: '36 Months (3 Years)' },
  { months: 42, label: '42 Months (3.5 Years)' },
  { months: 48, label: '48 Months (4 Years)' }
];

// ========================================================
// SUPPORTED PAYMENT METHODS & PARTNERS (As specified by User):
// 1. EASYPAISA
// 2. ASKRI BANK (Askari Bank)
// 3. ALFLAH (Bank Alfalah)
// 4. UPAISA
// 5. RAQMI ISLAMIC DIGITAL (Raqami Islamic Digital Bank)
// 6. Payway
// ========================================================

export const SUPPORTED_PAYMENT_CHANNELS = [
  {
    id: 'easypaisa',
    name: 'Easypaisa',
    category: 'Digital Wallet',
    tagline: 'Contact your agent for Payment verification',
    accountNumber: '03450951134',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    logo: '/easypaisa.webp',
    type: 'wallet' as const,
    featured: true
  },
  {
    id: 'askari',
    name: 'Askari Bank',
    category: 'Commercial Bank',
    tagline: 'Reliable & Trusted Banking',
    accountNumber: '01820980001234',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    code: 'AKBL',
    type: 'bank' as const,
    featured: true
  },
  {
    id: 'alfalah',
    name: 'Bank Alfalah',
    category: 'Premier Bank',
    tagline: 'The Way Forward',
    accountNumber: '55015001234567',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    code: 'BAL',
    logo: '/alflah.png',
    type: 'bank' as const,
    featured: true
  },
  {
    id: 'upaisa',
    name: 'UPaisa',
    category: 'Microfinance Wallet',
    tagline: 'Digital Payments for a Better Tomorrow',
    accountNumber: '03013136354',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    logo: '/upaisa.png',
    type: 'wallet' as const,
    featured: true
  },
  {
    id: 'raqami',
    name: 'Raqami Islamic Digital Bank',
    category: 'Islamic Digital Bank',
    tagline: 'Shariah Compliant • Digital Banking',
    accountNumber: '78601004567890',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    code: 'RIDB',
    logo: '/raqami-logo-card.png',
    type: 'bank' as const,
    featured: true
  },
  {
    id: 'payway',
    name: 'Payway Pakistan',
    category: 'Digital Payment Gateway',
    tagline: 'Fast, Secure Card & Bank Processing',
    accountNumber: 'PWY-8849-2041-01',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    code: 'PAYWAY',
    type: 'gateway' as const,
    featured: true
  },
  {
    id: 'abhi',
    name: 'ABHI Financing',
    category: 'Financing Partner',
    tagline: 'Instant Salary & EMI Approval Partner',
    accountNumber: 'ABHI-INSTALMENT-IML',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    code: 'ABHI',
    type: 'financing' as const,
    featured: false
  }
];

export const PAKISTAN_BANKS: BankOption[] = [
  { id: 'askari', name: 'Askari Bank Limited', code: 'AKBL' },
  { id: 'alfalah', name: 'Bank Alfalah Limited', code: 'BAL', logo: '/alflah.png' },
  { id: 'raqami', name: 'Raqami Islamic Digital Bank Limited', code: 'RIDB' },
  { id: 'hbl', name: 'Habib Bank Limited (HBL)', code: 'HBL' },
  { id: 'ubl', name: 'United Bank Limited (UBL)', code: 'UBL' },
  { id: 'mcb', name: 'MCB Bank Limited (MCB)', code: 'MCB' },
  { id: 'meezan', name: 'Meezan Bank Limited', code: 'MBL' },
  { id: 'faysal', name: 'Faysal Bank Limited', code: 'FBL' },
  { id: 'scb', name: 'Standard Chartered Bank Limited', code: 'SCB' },
  { id: 'bop', name: 'The Bank of Punjab', code: 'BOP' }
];

export const MOBILE_WALLETS: WalletOption[] = [
  {
    id: 'easypaisa',
    name: 'Easypaisa',
    tagline: 'Contact your agent for Payment verification',
    accountNumber: '0345 0951134',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    fee: '0%',
    logo: '/easypaisa.webp'
  },
  {
    id: 'upaisa',
    name: 'UPaisa',
    tagline: 'Digital Payments for a Better Tomorrow',
    accountNumber: '0301 3136354',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    fee: '0%',
    logo: '/upaisa.png'
  },
  {
    id: 'payway',
    name: 'Payway Portal',
    tagline: 'Instant 1-Click Secure Payment',
    accountNumber: 'PWY-8849-2041-01',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    fee: '0%'
  },
  {
    id: 'alfalah_wallet',
    name: 'Bank Alfalah Alfa Wallet',
    tagline: 'Alfa Digital Account',
    accountNumber: '0345 0951134',
    accountTitle: 'INSTALMENT MOBILE LIMITED',
    fee: '0%',
    logo: '/alflah.png'
  }
];

export const COMPANY_INFO = {
  name: 'INSTALMENT MOBILE LIMITED',
  shortName: 'IML',
  tagline: 'Official iPhone Installment Plans & Pricing Structure',
  subTagline: 'Premium • readable • customer-ready',
  phone1: '+92 345 0951134',
  phone2: '+92 301 3136354',
  whatsapp: '+92 345 0951134',
  email: 'support@instalmentmobile.pk',
  address: 'Suite #402, 4th Floor, Hafeez Center, Main Boulevard, Gulberg III, Lahore, Pakistan',
  requiredDocs: [
    { id: '01', title: 'CNIC / ID CARD', desc: "Customer's CNIC front & back or a clear copy." },
    { id: '02', title: 'UTILITY BILL', desc: 'Latest electricity / gas / water / PTCL bill showing current address.' },
    { id: '03', title: 'FAMILY MEMBER CNIC', desc: "If the utility bill is not in the customer's name, provide a family member's CNIC where applicable." },
    { id: '04', title: 'BALANCE / PAYMENT PROOF', desc: 'Current available-balance screenshot or required payment-account evidence.' },
    { id: '05', title: 'DELIVERY ADDRESS', desc: 'Complete and accurate delivery address for verification and dispatch.' },
    { id: '06', title: 'ELIGIBILITY DETAILS', desc: 'Any additional information requested during provider verification / approval.' }
  ]
};
