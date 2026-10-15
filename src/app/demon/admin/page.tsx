'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Plus,
  Trash2,
  Edit3,
  RotateCcw,
  Search,
  ArrowLeft,
  Smartphone,
  Palette,
  Layers,
  Sliders,
  LayoutGrid,
  List,
  Check,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Collapse,
  Divider,
  Drawer,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Button,
  IconButton,
  Fab,
  Tooltip,
  Snackbar,
  Alert,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Typography,
  Card,
  useMediaQuery
} from '@mui/material';

import { useWizard } from '../../../context/WizardContext';
import { BRANDS, SERIES, MobileModel, ColorOption, StorageOption } from '../../../data/catalog';

// Obsidian Telemetry — Mobile-First Admin Theme (Inspired by Stitch design)
const demonDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b0f17',
      paper: '#131a26',
    },
    primary: {
      main: '#06b6d4',
      light: '#4cd7f6',
      dark: '#0891b2',
      contrastText: '#001f26',
    },
    secondary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#38bdf8',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
    divider: 'rgba(255,255,255,0.06)',
  },
  typography: {
    fontFamily: ['Space Grotesk', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: 0,
    },
    h6: {
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    subtitle2: {
      fontFamily: 'Space Grotesk, sans-serif',
      fontWeight: 700,
    },
    caption: {
      fontFamily: 'Space Grotesk, monospace',
      letterSpacing: '0.01em',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          minHeight: 28,
          padding: '3px 10px',
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: 0,
        },
        sizeSmall: {
          padding: '2px 8px',
          fontSize: '0.68rem',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 9999,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#131a26',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#131a26',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#0b0f17',
            '& fieldset': { borderColor: '#1e293b' },
            '&:hover fieldset': { borderColor: '#334155' },
            '&.Mui-focused fieldset': {
              borderColor: '#06b6d4',
              boxShadow: '0 0 0 2px rgba(6, 182, 212, 0.18)',
            },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          backgroundColor: '#0b0f17',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(255,255,255,0.06)',
          padding: '6px 10px',
          fontSize: '0.75rem',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 36,
          textTransform: 'none',
          fontWeight: 700,
          fontFamily: 'Space Grotesk, sans-serif',
          fontSize: '0.74rem',
          letterSpacing: 0,
        },
      },
    },
  },
});

const PRESET_COLORS: ColorOption[] = [
  { name: 'Titanium Black', hex: '#1e293b' },
  { name: 'Natural Silver', hex: '#cbd5e1' },
  { name: 'Cobalt Blue', hex: '#2563eb' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Deep Violet', hex: '#7c3aed' },
  { name: 'Rose Gold', hex: '#f43f5e' }
];

export default function DemonResponsiveAdminPage() {
  const { modelsList, addModel, updateModel, deleteModel, resetCatalog } = useWizard();
  const isMobile = useMediaQuery('(max-width:640px)');

  // Revealing system state for mobile & desktop cards
  const [expandedCardIds, setExpandedCardIds] = useState<Record<string, boolean>>({});

  const toggleCardExpansion = (id: string) => {
    setExpandedCardIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleToggleExpandAll = () => {
    const areAnyExpanded = Object.values(expandedCardIds).some(Boolean);
    if (areAnyExpanded) {
      setExpandedCardIds({});
    } else {
      const all: Record<string, boolean> = {};
      modelsList.forEach((m) => { all[m.id] = true; });
      setExpandedCardIds(all);
    }
  };

  // Navigation Sidebar state (mobile drawer)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'catalog' | 'colors' | 'variants' | 'brands'>('catalog');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('all');
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<string>('all');

  // View Mode: grid vs table on desktop/mobile
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<MobileModel | null>(null);

  // Snackbar Toast Feedback
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'info' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const showToast = (message: string, severity: 'success' | 'info' | 'error' = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Form State
  const [formData, setFormData] = useState<{
    id: string;
    brandId: string;
    seriesId: string;
    name: string;
    basePrice: number;
    image: string;
    specs: string;
    colors: ColorOption[];
    storageOptions: StorageOption[];
  }>({
    id: '',
    brandId: 'samsung',
    seriesId: 'samsung-a',
    name: '',
    basePrice: 50000,
    image: '/samsung.svg',
    specs: '8GB RAM, 256GB Storage, Official Warranty',
    colors: [...PRESET_COLORS.slice(0, 3)],
    storageOptions: [{ size: 'Standard Storage', priceDelta: 0 }]
  });

  // Modal Temp Variant Inputs
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#2563eb');
  const [newStorageSize, setNewStorageSize] = useState('');
  const [newPriceDelta, setNewPriceDelta] = useState<number>(0);

  const availableSeriesForFilter = useMemo(() => {
    return selectedBrandFilter === 'all' 
      ? SERIES 
      : SERIES.filter((s) => s.brandId === selectedBrandFilter);
  }, [selectedBrandFilter]);

  const filteredModels = useMemo(() => {
    return modelsList.filter((m) => {
      const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBrand = selectedBrandFilter === 'all' || m.brandId === selectedBrandFilter;
      const matchesSeries = selectedSeriesFilter === 'all' || m.seriesId === selectedSeriesFilter;
      return matchesSearch && matchesBrand && matchesSeries;
    });
  }, [modelsList, searchTerm, selectedBrandFilter, selectedSeriesFilter]);

  // Key KPI stats for dense summary pills
  const minPrice = useMemo(() => {
    if (modelsList.length === 0) return 0;
    return Math.min(...modelsList.map((m) => m.basePrice));
  }, [modelsList]);

  const minEmi = useMemo(() => {
    if (modelsList.length === 0) return 0;
    return Math.round(minPrice / 36);
  }, [minPrice, modelsList]);

  const handleOpenAddModal = () => {
    setEditingModel(null);
    setFormData({
      id: `dev-${Date.now()}`,
      brandId: 'samsung',
      seriesId: 'samsung-a',
      name: '',
      basePrice: 50000,
      image: '/samsung.svg',
      specs: '8GB RAM, 256GB Storage, Official Warranty',
      colors: [...PRESET_COLORS.slice(0, 3)],
      storageOptions: [{ size: 'Standard Storage', priceDelta: 0 }]
    });
    setIsModalOpen(true);
    setIsSidebarOpen(false);
  };

  const handleOpenEditModal = (model: MobileModel) => {
    setEditingModel(model);
    setFormData({
      id: model.id,
      brandId: model.brandId,
      seriesId: model.seriesId,
      name: model.name,
      basePrice: model.basePrice,
      image: model.image,
      specs: model.specs.join(', '),
      colors: model.colors && model.colors.length > 0 ? [...model.colors] : [...PRESET_COLORS.slice(0, 3)],
      storageOptions: model.storageOptions && model.storageOptions.length > 0 ? [...model.storageOptions] : [{ size: 'Standard Storage', priceDelta: 0 }]
    });
    setIsModalOpen(true);
  };

  const handleAddColorToForm = () => {
    if (!newColorName.trim()) return;
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { name: newColorName.trim(), hex: newColorHex }]
    }));
    setNewColorName('');
  };

  const handleRemoveColorFromForm = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index)
    }));
  };

  const handleAddStorageToForm = () => {
    if (!newStorageSize.trim()) return;
    setFormData((prev) => ({
      ...prev,
      storageOptions: [...prev.storageOptions, { size: newStorageSize.trim(), priceDelta: Number(newPriceDelta) || 0 }]
    }));
    setNewStorageSize('');
    setNewPriceDelta(0);
  };

  const handleRemoveStorageFromForm = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      storageOptions: prev.storageOptions.filter((_, i) => i !== index)
    }));
  };

  const handleSaveModel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const baseP = Number(formData.basePrice) || 50000;
    const downP = Math.round(baseP * 0.3);
    const bal = baseP - downP;

    const specsArray = formData.specs.split(',').map((s) => s.trim()).filter(Boolean);

    const modelObj: MobileModel = {
      id: formData.id || `dev-${Date.now()}`,
      brandId: formData.brandId,
      seriesId: formData.seriesId,
      name: formData.name,
      variantType: 'PTA Approved',
      basePrice: baseP,
      downPayment: downP,
      balance: bal,
      installments: {
        12: Math.round(bal / 12),
        24: Math.round(bal / 24),
        36: Math.round(bal / 36)
      },
      image: formData.image || '/apple.png',
      specs: specsArray.length > 0 ? specsArray : ['Official Warranty'],
      colors: formData.colors.length > 0 ? formData.colors : PRESET_COLORS.slice(0, 2),
      storageOptions: formData.storageOptions.length > 0 ? formData.storageOptions : [{ size: 'Standard Storage', priceDelta: 0 }]
    };

    if (editingModel) {
      updateModel(modelObj);
      showToast(`Updated "${modelObj.name}" successfully`, 'success');
    } else {
      addModel(modelObj);
      showToast(`Added "${modelObj.name}" to catalog`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove "${name}" from store catalog?`)) {
      deleteModel(id);
      showToast(`Deleted "${name}"`, 'info');
    }
  };

  const handleReset = () => {
    if (confirm('Reset entire catalog back to official factory defaults?')) {
      resetCatalog();
      showToast('Catalog reset to defaults', 'info');
    }
  };

  // Render Sidebar Content
  const renderSidebarContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: 250, backgroundColor: '#0f172a' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Smartphone size={20} color="#06b6d4" />
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>
            IML Store Admin
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setIsSidebarOpen(false)} sx={{ display: { lg: 'none' }, color: '#94a3b8' }}>
          <X size={18} />
        </IconButton>
      </Box>

      <Box sx={{ p: 1.5, display: 'flex', flexDirection: 'column', gap: 0.8, flex: 1 }}>
        <Button
          fullWidth
          onClick={() => { setActiveTab('catalog'); setIsSidebarOpen(false); }}
          startIcon={<Smartphone size={16} />}
          sx={{
            justifyContent: 'flex-start',
            px: 1.5, py: 1,
            borderRadius: 2,
            backgroundColor: activeTab === 'catalog' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeTab === 'catalog' ? '#06b6d4' : '#94a3b8',
            '&:hover': { backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' },
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'left', fontSize: '0.78rem' }}>Device Catalog</Box>
          <Chip label={modelsList.length} size="small" sx={{ height: 18, fontSize: '0.65rem', backgroundColor: 'rgba(255,255,255,0.1)' }} />
        </Button>

        <Button
          fullWidth
          onClick={() => { setActiveTab('colors'); setIsSidebarOpen(false); }}
          startIcon={<Palette size={16} />}
          sx={{
            justifyContent: 'flex-start',
            px: 1.5, py: 1,
            borderRadius: 2,
            backgroundColor: activeTab === 'colors' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeTab === 'colors' ? '#06b6d4' : '#94a3b8',
            '&:hover': { backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' },
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'left', fontSize: '0.78rem' }}>Color Swatches</Box>
        </Button>

        <Button
          fullWidth
          onClick={() => { setActiveTab('variants'); setIsSidebarOpen(false); }}
          startIcon={<Layers size={16} />}
          sx={{
            justifyContent: 'flex-start',
            px: 1.5, py: 1,
            borderRadius: 2,
            backgroundColor: activeTab === 'variants' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeTab === 'variants' ? '#06b6d4' : '#94a3b8',
            '&:hover': { backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' },
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'left', fontSize: '0.78rem' }}>Storage Variants</Box>
        </Button>

        <Button
          fullWidth
          onClick={() => { setActiveTab('brands'); setIsSidebarOpen(false); }}
          startIcon={<Sliders size={16} />}
          sx={{
            justifyContent: 'flex-start',
            px: 1.5, py: 1,
            borderRadius: 2,
            backgroundColor: activeTab === 'brands' ? 'rgba(6, 182, 212, 0.15)' : 'transparent',
            color: activeTab === 'brands' ? '#06b6d4' : '#94a3b8',
            '&:hover': { backgroundColor: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4' },
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'left', fontSize: '0.78rem' }}>Brands &amp; Series</Box>
        </Button>
      </Box>

      <Box sx={{ p: 1.5, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleOpenAddModal}
          startIcon={<Plus size={15} />}
          sx={{ py: 0.9, fontWeight: 800, fontSize: '0.75rem' }}
        >
          + Add Device
        </Button>

        <Link href="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.8, color: '#94a3b8', fontSize: '0.75rem', py: 0.5, '&:hover': { color: '#ffffff' } }}>
            <ArrowLeft size={14} /> Back to Store
          </Box>
        </Link>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={demonDarkTheme}>
      <CssBaseline />
      
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f17', color: '#f8fafc', overflowX: 'hidden' }}>
        
        {/* Permanent Sidebar for Desktop (1024px+) */}
        <Box
          component="aside"
          sx={{
            width: 250,
            flexShrink: 0,
            display: { xs: 'none', lg: 'block' },
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 100,
            backgroundColor: '#0f172a',
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          {renderSidebarContent()}
        </Box>

        {/* Mobile Material UI Slide-in Drawer (<1024px) */}
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': {
              backgroundColor: '#0f172a',
              backgroundImage: 'none',
              width: 250,
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          {renderSidebarContent()}
        </Drawer>

        {/* Main Content Area Wrapper */}
        <Box
          sx={{
            flexGrow: 1,
            ml: { xs: 0, lg: '250px' },
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            width: { xs: '100%', lg: 'calc(100% - 250px)' },
          }}
        >
          
          {/* Material UI Sticky App Bar with Mobile Tabs */}
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              backgroundColor: 'rgba(11, 15, 23, 0.94)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              zIndex: 90,
            }}
          >
            <Toolbar
              variant="dense"
              sx={{
                minHeight: { xs: 44, sm: 50 },
                px: { xs: 1.2, sm: 2 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                <IconButton
                  onClick={() => setIsSidebarOpen(true)}
                  sx={{ display: { lg: 'none' }, color: '#ffffff', p: 0.4 }}
                  aria-label="Open Navigation Drawer"
                  size="small"
                >
                  <Menu size={18} />
                </IconButton>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: { xs: '0.88rem', sm: '1.05rem' } }}>
                  Admin Panel
                </Typography>
                <Chip
                  label="IML"
                  size="small"
                  sx={{
                    height: 16,
                    fontSize: '0.58rem',
                    fontWeight: 800,
                    backgroundColor: 'rgba(6, 182, 212, 0.15)',
                    color: '#06b6d4',
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                {/* Shorter Add Button */}
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleOpenAddModal}
                  startIcon={<Plus size={13} />}
                  sx={{
                    px: { xs: 1, sm: 1.4 },
                    py: 0.3,
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    borderRadius: 1.5,
                  }}
                >
                  + Add
                </Button>

                {/* Shorter Reset Button */}
                <Tooltip title="Reset catalog to factory defaults">
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="small"
                    onClick={handleReset}
                    startIcon={<RotateCcw size={12} />}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.15)',
                      color: '#94a3b8',
                      px: { xs: 0.7, sm: 1 },
                      py: 0.3,
                      fontSize: '0.68rem',
                      minWidth: 'auto',
                      borderRadius: 1.5,
                    }}
                  >
                    Reset
                  </Button>
                </Tooltip>
              </Box>
            </Toolbar>

            {/* Mobile Tabs Bar (<1024px) for 1-touch tab navigation */}
            <Box sx={{ display: { xs: 'block', lg: 'none' }, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                variant="scrollable"
                scrollButtons={false}
                sx={{
                  minHeight: 34,
                  '& .MuiTabs-indicator': { backgroundColor: '#06b6d4', height: 2 },
                }}
              >
                <Tab
                  label={`Devices (${modelsList.length})`}
                  value="catalog"
                  icon={<Smartphone size={13} />}
                  iconPosition="start"
                  sx={{ minHeight: 34, py: 0.3, px: 1.2, fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', '&.Mui-selected': { color: '#06b6d4' } }}
                />
                <Tab
                  label="Colors"
                  value="colors"
                  icon={<Palette size={13} />}
                  iconPosition="start"
                  sx={{ minHeight: 34, py: 0.3, px: 1.2, fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', '&.Mui-selected': { color: '#06b6d4' } }}
                />
                <Tab
                  label="Variants"
                  value="variants"
                  icon={<Layers size={13} />}
                  iconPosition="start"
                  sx={{ minHeight: 34, py: 0.3, px: 1.2, fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', '&.Mui-selected': { color: '#06b6d4' } }}
                />
                <Tab
                  label="Brands"
                  value="brands"
                  icon={<Sliders size={13} />}
                  iconPosition="start"
                  sx={{ minHeight: 34, py: 0.3, px: 1.2, fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', '&.Mui-selected': { color: '#06b6d4' } }}
                />
              </Tabs>
            </Box>
          </AppBar>

          {/* Quick KPI Metric Strip (Stitch Obsidian Telemetry feature) */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.8,
              overflowX: 'auto',
              px: { xs: 1, sm: 2 },
              py: 0.8,
              backgroundColor: '#0e1420',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              '&::-webkit-scrollbar': { height: 0 },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 1, py: 0.3, borderRadius: 1.5, backgroundColor: 'rgba(6, 182, 212, 0.1)', flexShrink: 0 }}>
              <Smartphone size={12} color="#06b6d4" />
              <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.68rem' }}>
                Total: <strong>{modelsList.length}</strong>
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 1, py: 0.3, borderRadius: 1.5, backgroundColor: 'rgba(16, 185, 129, 0.1)', flexShrink: 0 }}>
              <ShieldCheck size={12} color="#10b981" />
              <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, fontSize: '0.68rem' }}>
                PTA Active
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 1, py: 0.3, borderRadius: 1.5, backgroundColor: 'rgba(59, 130, 246, 0.1)', flexShrink: 0 }}>
              <TrendingUp size={12} color="#3b82f6" />
              <Typography variant="caption" sx={{ color: '#93c5fd', fontWeight: 700, fontSize: '0.68rem' }}>
                From Rs. {minEmi.toLocaleString('en-PK')}/mo
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 1, py: 0.3, borderRadius: 1.5, backgroundColor: 'rgba(245, 158, 11, 0.1)', flexShrink: 0 }}>
              <Sparkles size={12} color="#f59e0b" />
              <Typography variant="caption" sx={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.68rem' }}>
                0% Markup Active
              </Typography>
            </Box>
          </Box>

          {/* Inner Workspace Container (Smaller containers on phone) */}
          <Box
            sx={{
              p: { xs: 0.9, sm: 1.5, md: 2 },
              maxWidth: 1300,
              width: '100%',
              mx: 'auto',
              boxSizing: 'border-box',
            }}
          >
            
            {/* High-Density Compact Filter Card */}
            <Card
              sx={{
                background: 'linear-gradient(135deg, #111827 0%, #0d121c 100%)',
                border: '1px solid rgba(6, 182, 212, 0.15)',
                borderRadius: { xs: 2, sm: 2.5 },
                p: { xs: 1, sm: 1.5 },
                mb: { xs: 1, sm: 1.5 },
              }}
            >
              {/* Header Info & View Mode Toggle */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: { xs: '0.8rem', sm: '0.95rem' } }}>
                  {activeTab === 'catalog' && `Device Catalog (${filteredModels.length})`}
                  {activeTab === 'colors' && 'Color Swatches'}
                  {activeTab === 'variants' && 'Storage Variants'}
                  {activeTab === 'brands' && 'Brands & Series'}
                </Typography>

                {activeTab === 'catalog' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                    {/* Shorter Reveal All Button */}
                    <Button
                      size="small"
                      variant="text"
                      onClick={handleToggleExpandAll}
                      sx={{
                        fontSize: '0.68rem',
                        py: 0.15,
                        px: 0.7,
                        minWidth: 'auto',
                        color: '#06b6d4',
                        fontWeight: 700,
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        borderRadius: 1.5,
                      }}
                    >
                      {Object.values(expandedCardIds).some(Boolean) ? 'Hide All' : 'Specs All'}
                    </Button>

                    {/* Grid / Table View Toggle */}
                    <Box
                      sx={{
                        display: 'flex',
                        backgroundColor: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 1.5,
                        p: 0.15,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setViewMode('grid')}
                        sx={{
                          p: 0.35,
                          borderRadius: 1.2,
                          backgroundColor: viewMode === 'grid' ? '#06b6d4' : 'transparent',
                          color: viewMode === 'grid' ? '#001f26' : '#94a3b8',
                        }}
                        title="Grid View"
                      >
                        <LayoutGrid size={13} />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => setViewMode('table')}
                        sx={{
                          p: 0.35,
                          borderRadius: 1.2,
                          backgroundColor: viewMode === 'table' ? '#06b6d4' : 'transparent',
                          color: viewMode === 'table' ? '#001f26' : '#94a3b8',
                        }}
                        title="Table View"
                      >
                        <List size={13} />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* High-Density Filters Row */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 0.8 }}>
                
                {/* Search Field */}
                <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 160 } }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search model, series..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search size={14} color="#94a3b8" style={{ marginRight: 6 }} />,
                      endAdornment: searchTerm ? (
                        <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: '#94a3b8', p: 0.2 }}>
                          <X size={13} />
                        </IconButton>
                      ) : null,
                      sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: 1.5,
                        fontSize: '0.78rem',
                        height: 32,
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      },
                    }}
                  />
                </Box>

                {/* Brand & Series Select Filters */}
                <Box sx={{ display: 'flex', gap: 0.8, width: { xs: '100%', sm: 'auto' } }}>
                  <FormControl size="small" sx={{ flex: 1, minWidth: { xs: 0, sm: 120 } }}>
                    <Select
                      value={selectedBrandFilter}
                      onChange={(e) => {
                        setSelectedBrandFilter(e.target.value);
                        setSelectedSeriesFilter('all');
                      }}
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        height: 32,
                        color: '#ffffff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      }}
                    >
                      <MenuItem value="all">All Brands</MenuItem>
                      {BRANDS.map((b) => (
                        <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ flex: 1, minWidth: { xs: 0, sm: 110 } }}>
                    <Select
                      value={selectedSeriesFilter}
                      onChange={(e) => setSelectedSeriesFilter(e.target.value)}
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.4)',
                        borderRadius: 1.5,
                        fontSize: '0.75rem',
                        height: 32,
                        color: '#ffffff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.1)' },
                      }}
                    >
                      <MenuItem value="all">All Series</MenuItem>
                      {availableSeriesForFilter.map((s) => (
                        <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </Box>

              {/* Horizontal Scrollable Brand Pills (Dense) */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.6,
                  overflowX: 'auto',
                  mt: 0.8,
                  pb: 0.2,
                  '&::-webkit-scrollbar': { height: 2 },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 },
                }}
              >
                <Chip
                  label={`All (${modelsList.length})`}
                  onClick={() => { setSelectedBrandFilter('all'); setSelectedSeriesFilter('all'); }}
                  color={selectedBrandFilter === 'all' ? 'primary' : 'default'}
                  variant={selectedBrandFilter === 'all' ? 'filled' : 'outlined'}
                  size="small"
                  clickable
                  sx={{ height: 20, borderRadius: 2, fontWeight: 700, fontSize: '0.65rem', px: 0.4 }}
                />
                {BRANDS.map((b) => {
                  const count = modelsList.filter((m) => m.brandId === b.id).length;
                  const isSelected = selectedBrandFilter === b.id;
                  return (
                    <Chip
                      key={b.id}
                      label={`${b.name} (${count})`}
                      onClick={() => { setSelectedBrandFilter(b.id); setSelectedSeriesFilter('all'); }}
                      color={isSelected ? 'primary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      size="small"
                      clickable
                      sx={{ height: 20, borderRadius: 2, fontWeight: 600, fontSize: '0.65rem', px: 0.4, borderColor: isSelected ? undefined : 'rgba(255,255,255,0.1)' }}
                    />
                  );
                })}
              </Box>
            </Card>

            {/* TAB 1: DEVICE CATALOG */}
            {activeTab === 'catalog' && (
              <>
                {filteredModels.length > 0 ? (
                  <>
                    {/* TABLE VIEW */}
                    {viewMode === 'table' && (
                      <TableContainer
                        component={Paper}
                        sx={{
                          backgroundColor: '#131a26',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: 2.5,
                          overflowX: 'auto',
                          mb: 2,
                        }}
                      >
                        <Table size="small" aria-label="Device Catalog Table" sx={{ minWidth: 600 }}>
                          <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.35)' }}>
                            <TableRow>
                              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.72rem' }}>DEVICE</TableCell>
                              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.72rem' }}>BRAND / SERIES</TableCell>
                              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.72rem' }}>SWATCHES</TableCell>
                              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.72rem' }}>CASH PRICE</TableCell>
                              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.72rem' }}>24-MO EMI</TableCell>
                              <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.72rem' }}>ACTIONS</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredModels.map((model) => {
                              const brand = BRANDS.find((b) => b.id === model.brandId);
                              const series = SERIES.find((s) => s.id === model.seriesId);
                              const monthly = Math.round(model.basePrice / 24);

                              return (
                                <TableRow key={model.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderColor: 'rgba(255,255,255,0.04)' }}>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Box
                                        component="img"
                                        src={model.image}
                                        alt={model.name}
                                        sx={{ width: 32, height: 32, objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: 1.5, p: 0.3 }}
                                      />
                                      <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.82rem' }}>
                                          {model.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>
                                          {model.specs.join(' • ')}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>

                                  <TableCell>
                                    <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.75rem' }}>
                                      {brand?.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>
                                      {series?.name}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.4, alignItems: 'center' }}>
                                      {model.colors && model.colors.map((c, i) => (
                                        <Tooltip title={c.name} key={i} arrow>
                                          <Box
                                            sx={{
                                              width: 12,
                                              height: 12,
                                              borderRadius: '50%',
                                              backgroundColor: c.hex,
                                              border: '1px solid rgba(255,255,255,0.3)',
                                            }}
                                          />
                                        </Tooltip>
                                      ))}
                                    </Box>
                                  </TableCell>

                                  <TableCell sx={{ color: '#f43f5e', fontWeight: 800, fontSize: '0.8rem' }}>
                                    Rs. {model.basePrice.toLocaleString('en-PK')}
                                  </TableCell>

                                  <TableCell sx={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.76rem' }}>
                                    Rs. {monthly.toLocaleString('en-PK')}/mo
                                  </TableCell>

                                  <TableCell align="right">
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.6 }}>
                                      <Button
                                        size="small"
                                        onClick={() => handleOpenEditModal(model)}
                                        startIcon={<Edit3 size={12} />}
                                        sx={{
                                          fontSize: '0.68rem',
                                          py: 0.25,
                                          px: 0.8,
                                          backgroundColor: 'rgba(6, 182, 212, 0.15)',
                                          color: '#06b6d4',
                                          '&:hover': { backgroundColor: 'rgba(6, 182, 212, 0.25)' },
                                        }}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        size="small"
                                        onClick={() => handleDelete(model.id, model.name)}
                                        startIcon={<Trash2 size={12} />}
                                        sx={{
                                          fontSize: '0.68rem',
                                          py: 0.25,
                                          px: 0.8,
                                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                          color: '#f87171',
                                          '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.25)' },
                                        }}
                                      >
                                        Del
                                      </Button>
                                    </Box>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}

                    {/* GRID VIEW: Redesigned Mobile-Optimized Compact Cards */}
                    {viewMode === 'grid' && (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                          },
                          gap: { xs: 0.9, sm: 1.2 },
                          width: '100%',
                        }}
                      >
                        {filteredModels.map((model) => {
                          const brand = BRANDS.find((b) => b.id === model.brandId);
                          const series = SERIES.find((s) => s.id === model.seriesId);
                          const monthly = Math.round(model.basePrice / 24);
                          const isExpanded = !!expandedCardIds[model.id];

                          const downP = model.downPayment ?? Math.round(model.basePrice * 0.3);
                          const emi12 = model.installments?.[12] ?? Math.round((model.basePrice - downP) / 12);
                          const emi24 = model.installments?.[24] ?? Math.round((model.basePrice - downP) / 24);
                          const emi36 = model.installments?.[36] ?? Math.round((model.basePrice - downP) / 36);

                          return (
                            <Card
                              key={model.id}
                              sx={{
                                backgroundColor: '#131a26',
                                border: isExpanded ? '1px solid rgba(6, 182, 212, 0.4)' : '1px solid rgba(255, 255, 255, 0.06)',
                                borderRadius: { xs: 2, sm: 2.5 },
                                transition: 'all 0.2s ease',
                                overflow: 'hidden',
                              }}
                            >
                              {/* Compact Primary Row (High Density on Mobile) */}
                              <Box sx={{ p: { xs: 0.9, sm: 1.2 } }}>
                                
                                {/* Top Line: Thumbnail + Title + Brand/PTA */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  
                                  {/* Device Thumbnail */}
                                  <Box
                                    sx={{
                                      width: { xs: 34, sm: 38 },
                                      height: { xs: 34, sm: 38 },
                                      backgroundColor: '#ffffff',
                                      borderRadius: 1.5,
                                      p: 0.3,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      flexShrink: 0,
                                    }}
                                  >
                                    <Box component="img" src={model.image} alt={model.name} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                                  </Box>

                                  {/* Model Info */}
                                  <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 0.4 }}>
                                      <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.62rem', textTransform: 'uppercase' }}>
                                        {brand?.name} • {series?.name}
                                      </Typography>
                                      <Chip label="PTA" size="small" sx={{ height: 14, fontSize: '0.52rem', fontWeight: 800, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }} />
                                    </Box>
                                    
                                    <Typography
                                      variant="subtitle2"
                                      sx={{
                                        fontWeight: 800,
                                        color: '#ffffff',
                                        fontSize: { xs: '0.82rem', sm: '0.88rem' },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        lineHeight: 1.2,
                                        my: 0.1,
                                      }}
                                    >
                                      {model.name}
                                    </Typography>

                                    {/* Pricing & Installment Badge */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                                      <Typography variant="caption" sx={{ color: '#f43f5e', fontWeight: 900, fontSize: '0.76rem' }}>
                                        Rs. {model.basePrice.toLocaleString('en-PK')}
                                      </Typography>
                                      <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.7rem' }}>
                                        Rs. {monthly.toLocaleString('en-PK')}/mo
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>

                                {/* Micro-Bar Actions (Very Compact and clean on phone) */}
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.8, pt: 0.6, borderTop: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                  
                                  {/* Color dots preview */}
                                  <Box sx={{ display: 'flex', gap: 0.4, alignItems: 'center' }}>
                                    {model.colors?.slice(0, 3).map((c, i) => (
                                      <Box
                                        key={i}
                                        sx={{
                                          width: 10,
                                          height: 10,
                                          borderRadius: '50%',
                                          backgroundColor: c.hex,
                                          border: '1px solid rgba(255,255,255,0.3)',
                                        }}
                                      />
                                    ))}
                                    {(model.colors?.length || 0) > 3 && (
                                      <Typography variant="caption" sx={{ fontSize: '0.6rem', color: '#64748b' }}>
                                        +{(model.colors?.length || 0) - 3}
                                      </Typography>
                                    )}
                                  </Box>

                                  {/* Shorter Action Buttons */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                    <Button
                                      size="small"
                                      onClick={() => handleOpenEditModal(model)}
                                      sx={{
                                        minWidth: 'auto',
                                        px: 0.8,
                                        py: 0.2,
                                        fontSize: '0.68rem',
                                        color: '#06b6d4',
                                        fontWeight: 700,
                                        backgroundColor: 'rgba(6, 182, 212, 0.12)',
                                        borderRadius: 1.2,
                                        '&:hover': { backgroundColor: 'rgba(6, 182, 212, 0.22)' }
                                      }}
                                    >
                                      Edit
                                    </Button>

                                    <Button
                                      size="small"
                                      onClick={() => handleDelete(model.id, model.name)}
                                      sx={{
                                        minWidth: 'auto',
                                        px: 0.8,
                                        py: 0.2,
                                        fontSize: '0.68rem',
                                        color: '#f87171',
                                        fontWeight: 700,
                                        backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                        borderRadius: 1.2,
                                        '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.22)' }
                                      }}
                                    >
                                      Del
                                    </Button>

                                    {/* Revealing Toggle Button */}
                                    <Button
                                      size="small"
                                      variant="outlined"
                                      onClick={() => toggleCardExpansion(model.id)}
                                      endIcon={isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                                      sx={{
                                        minWidth: 'auto',
                                        px: 0.8,
                                        py: 0.2,
                                        fontSize: '0.68rem',
                                        borderRadius: 1.2,
                                        borderColor: isExpanded ? '#06b6d4' : 'rgba(255, 255, 255, 0.12)',
                                        color: isExpanded ? '#06b6d4' : '#cbd5e1',
                                        backgroundColor: isExpanded ? 'rgba(6, 182, 212, 0.08)' : 'transparent',
                                      }}
                                    >
                                      {isExpanded ? 'Hide' : 'Specs'}
                                    </Button>
                                  </Box>
                                </Box>
                              </Box>

                              {/* REVEALING SYSTEM: Collapsible Detailed Breakdown */}
                              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.05)' }} />
                                <Box sx={{ p: { xs: 0.9, sm: 1.2 }, backgroundColor: 'rgba(0, 0, 0, 0.3)', display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                                  
                                  {/* Specs tags */}
                                  <Box>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.62rem', textTransform: 'uppercase', display: 'block', mb: 0.3 }}>
                                      Specs &amp; Warranty:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3 }}>
                                      {model.specs.map((sp, i) => (
                                        <Chip key={i} label={sp} size="small" sx={{ height: 16, fontSize: '0.6rem', backgroundColor: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }} />
                                      ))}
                                    </Box>
                                  </Box>

                                  {/* Color Swatches */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.6 }}>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.62rem', textTransform: 'uppercase' }}>
                                      Colors:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.6, alignItems: 'center' }}>
                                      {model.colors && model.colors.map((c, i) => (
                                        <Tooltip key={i} title={c.name} arrow>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.3 }}>
                                            <Box sx={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: c.hex, border: '1px solid rgba(255,255,255,0.3)' }} />
                                            <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '0.62rem' }}>{c.name}</Typography>
                                          </Box>
                                        </Tooltip>
                                      ))}
                                    </Box>
                                  </Box>

                                  {/* Storage Variants */}
                                  {model.storageOptions && model.storageOptions.length > 0 && (
                                    <Box>
                                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.62rem', textTransform: 'uppercase', display: 'block', mb: 0.3 }}>
                                        Storage Variants:
                                      </Typography>
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                                        {model.storageOptions.map((st, i) => (
                                          <Chip
                                            key={i}
                                            label={`${st.size} ${st.priceDelta > 0 ? `(+Rs. ${st.priceDelta.toLocaleString('en-PK')})` : '(Base)'}`}
                                            size="small"
                                            sx={{ height: 18, fontSize: '0.62rem', fontWeight: 600, backgroundColor: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4' }}
                                          />
                                        ))}
                                      </Box>
                                    </Box>
                                  )}

                                  {/* Installment Plan Breakdown Grid (4 columns) */}
                                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.4, backgroundColor: 'rgba(0, 0, 0, 0.35)', p: 0.6, borderRadius: 1.5 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.55rem', display: 'block', fontWeight: 700 }}>DOWN</Typography>
                                      <Typography variant="caption" sx={{ color: '#f8fafc', fontSize: '0.65rem', fontWeight: 800 }}>Rs. {downP.toLocaleString('en-PK')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.55rem', display: 'block', fontWeight: 700 }}>12-MO</Typography>
                                      <Typography variant="caption" sx={{ color: '#06b6d4', fontSize: '0.65rem', fontWeight: 800 }}>Rs. {emi12.toLocaleString('en-PK')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.55rem', display: 'block', fontWeight: 700 }}>24-MO</Typography>
                                      <Typography variant="caption" sx={{ color: '#06b6d4', fontSize: '0.65rem', fontWeight: 800 }}>Rs. {emi24.toLocaleString('en-PK')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.55rem', display: 'block', fontWeight: 700 }}>36-MO</Typography>
                                      <Typography variant="caption" sx={{ color: '#06b6d4', fontSize: '0.65rem', fontWeight: 800 }}>Rs. {emi36.toLocaleString('en-PK')}</Typography>
                                    </Box>
                                  </Box>

                                </Box>
                              </Collapse>
                            </Card>
                          );
                        })}
                      </Box>
                    )}
                  </>
                ) : (
                  <Card sx={{ p: 4, textAlign: 'center', backgroundColor: '#131a26', borderRadius: 2.5 }}>
                    <Smartphone size={36} color="#64748b" style={{ marginBottom: 8 }} />
                    <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 700, mb: 1.5 }}>
                      No devices match current filter.
                    </Typography>
                    <Button variant="contained" color="primary" size="small" onClick={handleOpenAddModal} startIcon={<Plus size={14} />}>
                      Add Device
                    </Button>
                  </Card>
                )}
              </>
            )}

            {/* TAB 2: COLOR SWATCHES MANAGER */}
            {activeTab === 'colors' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff' }}>
                  Global Color Variations
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1 }}>
                  {PRESET_COLORS.map((preset, idx) => {
                    const matchedModels = modelsList.filter((m) => m.colors?.some((c) => c.hex.toLowerCase() === preset.hex.toLowerCase()));
                    return (
                      <Card key={idx} sx={{ backgroundColor: '#131a26', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 2, p: 1.2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.6 }}>
                          <Box sx={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: preset.hex, border: '2px solid rgba(255,255,255,0.4)', flexShrink: 0 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.78rem', lineHeight: 1.2 }}>{preset.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem' }}>{preset.hex}</Typography>
                          </Box>
                          <Chip label={`${matchedModels.length}`} size="small" color="primary" sx={{ height: 16, fontSize: '0.62rem', fontWeight: 800 }} />
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3, mt: 0.4 }}>
                          {matchedModels.length > 0 ? (
                            matchedModels.map((m) => (
                              <Chip key={m.id} label={m.name} size="small" variant="outlined" sx={{ height: 16, fontSize: '0.58rem', color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.1)' }} />
                            ))
                          ) : (
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.62rem' }}>No models assigned</Typography>
                          )}
                        </Box>
                      </Card>
                    );
                  })}
                </Box>
              </Box>
            )}

            {/* TAB 3: STORAGE VARIANTS MANAGER */}
            {activeTab === 'variants' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff' }}>
                  Storage Configurations
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                  {modelsList.map((m) => (
                    <Card key={m.id} sx={{ backgroundColor: '#131a26', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 2, p: 1 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.4 }}>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.8rem' }}>{m.name}</Typography>
                          <Typography variant="caption" sx={{ color: '#f43f5e', fontWeight: 800, fontSize: '0.7rem' }}>
                            Base: Rs. {m.basePrice.toLocaleString('en-PK')}
                          </Typography>
                        </Box>
                        <Button size="small" onClick={() => handleOpenEditModal(m)} sx={{ color: '#06b6d4', py: 0.2, px: 0.8, minWidth: 'auto', fontSize: '0.68rem', fontWeight: 700, backgroundColor: 'rgba(6, 182, 212, 0.12)', borderRadius: 1.2 }}>
                          Edit
                        </Button>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, mt: 0.4 }}>
                        {m.storageOptions?.map((st, i) => (
                          <Chip
                            key={i}
                            label={`${st.size} ${st.priceDelta > 0 ? `(+Rs. ${st.priceDelta.toLocaleString('en-PK')})` : '(Base)'}`}
                            size="small"
                            sx={{ height: 18, backgroundColor: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', fontSize: '0.62rem', fontWeight: 600 }}
                          />
                        ))}
                      </Box>
                    </Card>
                  ))}
                </Box>
              </Box>
            )}

            {/* TAB 4: BRANDS & SERIES DIRECTORY */}
            {activeTab === 'brands' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff' }}>
                  Official Brands &amp; Series
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1 }}>
                  {BRANDS.map((b) => {
                    const brandModels = modelsList.filter((m) => m.brandId === b.id);
                    const brandSeries = SERIES.filter((s) => s.brandId === b.id);

                    return (
                      <Card key={b.id} sx={{ backgroundColor: '#131a26', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: 2, p: 1.2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.8 }}>
                          <Box component="img" src={b.logoUrl} alt={b.name} sx={{ width: 28, height: 28, objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: 1.2, p: 0.3 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.8rem' }}>{b.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.65rem' }}>{brandModels.length} Devices</Typography>
                          </Box>
                          <Button
                            size="small"
                            onClick={() => { setSelectedBrandFilter(b.id); setActiveTab('catalog'); }}
                            sx={{ minWidth: 'auto', px: 0.8, py: 0.25, fontSize: '0.68rem', fontWeight: 700, backgroundColor: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', borderRadius: 1.2 }}
                          >
                            View
                          </Button>
                        </Box>

                        <Typography variant="caption" sx={{ color: '#06b6d4', fontWeight: 700, fontSize: '0.62rem', display: 'block', mb: 0.3 }}>Series:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.3 }}>
                          {brandSeries.map((s) => (
                            <Chip key={s.id} label={s.name} size="small" variant="outlined" sx={{ height: 16, fontSize: '0.6rem', color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.1)' }} />
                          ))}
                        </Box>
                      </Card>
                    );
                  })}
                </Box>
              </Box>
            )}

          </Box>
        </Box>

        {/* Mobile Floating Action Button (FAB) - Compact 40px */}
        <Fab
          color="primary"
          aria-label="Add Device"
          onClick={handleOpenAddModal}
          size="small"
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 20 },
            right: { xs: 16, sm: 20 },
            display: { xs: 'flex', lg: 'none' },
            boxShadow: '0 4px 18px rgba(6, 182, 212, 0.45)',
            zIndex: 120,
            width: 42,
            height: 42,
          }}
        >
          <Plus size={20} color="#001f26" />
        </Fab>

        {/* Material UI Responsive Add/Edit Dialog Modal (Bottom Sheet on Mobile) */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fullWidth
          maxWidth="sm"
          PaperProps={{
            sx: {
              backgroundColor: '#0f172a',
              backgroundImage: 'none',
              border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: isMobile ? '16px 16px 0 0' : 3,
              m: isMobile ? 0 : 2,
              maxHeight: isMobile ? '92vh' : '85vh',
              position: isMobile ? 'fixed' : 'relative',
              bottom: isMobile ? 0 : 'auto',
              width: '100%',
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1, pt: 1.5, px: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff', fontSize: { xs: '0.95rem', sm: '1.1rem' } }}>
                {editingModel ? `Edit: ${editingModel.name}` : 'Add New Device'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.7rem' }}>
                Catalog details, specs, color options &amp; pricing.
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setIsModalOpen(false)} sx={{ color: '#94a3b8' }}>
              <X size={18} />
            </IconButton>
          </DialogTitle>

          <Box component="form" onSubmit={handleSaveModel} sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 1.5, py: 1.5, px: 2, overflowY: 'auto', flex: 1 }}>
              
              {/* Brand & Series Responsive Selects */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                <FormControl size="small" fullWidth>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.3 }}>Brand *</Typography>
                  <Select
                    value={formData.brandId}
                    onChange={(e) => {
                      const bId = e.target.value;
                      const availSeries = SERIES.filter((s) => s.brandId === bId);
                      const brandObj = BRANDS.find((b) => b.id === bId);
                      setFormData({
                        ...formData,
                        brandId: bId,
                        seriesId: availSeries[0]?.id || '',
                        image: brandObj?.logoUrl || '/samsung.svg'
                      });
                    }}
                    sx={{ backgroundColor: '#0b0f17', borderRadius: 1.5, color: '#ffffff', height: 34, fontSize: '0.8rem' }}
                  >
                    {BRANDS.map((b) => (
                      <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.3 }}>Series *</Typography>
                  <Select
                    value={formData.seriesId}
                    onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                    sx={{ backgroundColor: '#0b0f17', borderRadius: 1.5, color: '#ffffff', height: 34, fontSize: '0.8rem' }}
                  >
                    {SERIES.filter((s) => s.brandId === formData.brandId).map((s) => (
                      <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Model Name */}
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.3, display: 'block' }}>Device Model Name *</Typography>
                <TextField
                  fullWidth
                  size="small"
                  required
                  placeholder="e.g. S-25 Ultra 12/512 or iPhone 17 Pro"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  InputProps={{
                    sx: { backgroundColor: '#0b0f17', borderRadius: 1.5, color: '#ffffff', fontSize: '0.8rem', height: 34 }
                  }}
                />
              </Box>

              {/* Price & Image Source */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.3, display: 'block' }}>Base Price (PKR) *</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    required
                    placeholder="128000"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    InputProps={{
                      sx: { backgroundColor: '#0b0f17', borderRadius: 1.5, color: '#ffffff', fontSize: '0.8rem', height: 34 }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.3, display: 'block' }}>Image / Logo Path</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="/samsung.svg or /apple.png"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    InputProps={{
                      sx: { backgroundColor: '#0b0f17', borderRadius: 1.5, color: '#ffffff', fontSize: '0.8rem', height: 34 }
                    }}
                  />
                </Box>
              </Box>

              {/* Specs */}
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.3, display: 'block' }}>Specs Tags (Comma-separated)</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="8GB RAM, 256GB Storage, Official Warranty"
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  InputProps={{
                    sx: { backgroundColor: '#0b0f17', borderRadius: 1.5, color: '#ffffff', fontSize: '0.8rem', height: 34 }
                  }}
                />
              </Box>

              {/* COLOR VARIATIONS MANAGER */}
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, p: 1.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                  <Palette size={15} color="#06b6d4" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.8rem' }}>Color Variations</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 1 }}>
                  {formData.colors.map((c, idx) => (
                    <Chip
                      key={idx}
                      avatar={<Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: c.hex, ml: '3px !important' }} />}
                      label={c.name}
                      onDelete={() => handleRemoveColorFromForm(idx)}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#ffffff', fontSize: '0.68rem', height: 22 }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    placeholder="Color Name"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    sx={{ flex: { xs: '1 1 120px', sm: 1 }, '& input': { p: 0.6, fontSize: '0.75rem', height: 20 } }}
                    InputProps={{ sx: { backgroundColor: '#0b0f17', borderRadius: 1.5, color: '#ffffff' } }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      style={{ width: 30, height: 30, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 4 }}
                    />
                    <Button size="small" variant="outlined" onClick={handleAddColorToForm} sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.15)', fontSize: '0.68rem' }}>
                      + Color
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* STORAGE & RAM VARIANTS MANAGER */}
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 2, p: 1.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                  <Layers size={15} color="#10b981" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.8rem' }}>Storage Variants &amp; Price Deltas</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.6, mb: 1 }}>
                  {formData.storageOptions.map((st, idx) => (
                    <Chip
                      key={idx}
                      label={`${st.size} ${st.priceDelta > 0 ? `(+Rs. ${st.priceDelta.toLocaleString('en-PK')})` : '(Base)'}`}
                      onDelete={() => handleRemoveStorageFromForm(idx)}
                      size="small"
                      sx={{ backgroundColor: 'rgba(6, 182, 212, 0.12)', color: '#06b6d4', fontSize: '0.68rem', fontWeight: 700, height: 22 }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    placeholder="Variant (12/512GB)"
                    value={newStorageSize}
                    onChange={(e) => setNewStorageSize(e.target.value)}
                    sx={{ flex: { xs: '1 1 110px', sm: 1 }, '& input': { p: 0.6, fontSize: '0.75rem', height: 20 } }}
                    InputProps={{ sx: { backgroundColor: '#0b0f17', borderRadius: 1.5, color: '#ffffff' } }}
                  />
                  <TextField
                    size="small"
                    type="number"
                    placeholder="+Delta"
                    value={newPriceDelta}
                    onChange={(e) => setNewPriceDelta(Number(e.target.value))}
                    sx={{ width: { xs: 75, sm: 90 }, '& input': { p: 0.6, fontSize: '0.75rem', height: 20 } }}
                    InputProps={{ sx: { backgroundColor: '#0b0f17', borderRadius: 1.5, color: '#ffffff' } }}
                  />
                  <Button size="small" variant="outlined" onClick={handleAddStorageToForm} sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.15)', fontSize: '0.68rem' }}>
                    + Variant
                  </Button>
                </Box>
              </Box>

            </DialogContent>

            <DialogActions sx={{ p: 1.2, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: '#0f172a' }}>
              <Button onClick={() => setIsModalOpen(false)} size="small" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" size="small" sx={{ px: 2, py: 0.5, fontWeight: 800, fontSize: '0.75rem' }}>
                {editingModel ? 'Save Changes' : 'Create Device'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Snackbar Toast Feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3500}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%', borderRadius: 2, fontWeight: 700, fontSize: '0.78rem' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
}
