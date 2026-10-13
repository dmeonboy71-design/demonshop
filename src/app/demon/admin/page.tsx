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
  ChevronRight,
  ChevronDown,
  ChevronUp
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
  Stack,
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
  CardContent,
  useMediaQuery
} from '@mui/material';

import { useWizard } from '../../../context/WizardContext';
import { BRANDS, SERIES, MobileModel, ColorOption, StorageOption } from '../../../data/catalog';

// Dark Custom Material UI Theme matching Demon Panel identity
const demonDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#0b0f19',
      paper: '#0f172a',
    },
    primary: {
      main: '#dc2626',
      light: '#ef4444',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#6366f1',
      light: '#818cf8',
      dark: '#4f46e5',
    },
    info: {
      main: '#38bdf8',
    },
    success: {
      main: '#10b981',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: ['Outfit', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'].join(','),
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 14,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: '8px 16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
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

  // Render Sidebar Content shared between Desktop & MUI Mobile Drawer
  const renderSidebarContent = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: 270, backgroundColor: '#0f172a' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Smartphone size={24} color="#818cf8" />
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', fontSize: '1.1rem' }}>
            Alfa Mobiles
          </Typography>
        </Box>
        <IconButton size="small" onClick={() => setIsSidebarOpen(false)} sx={{ display: { lg: 'none' }, color: '#94a3b8' }}>
          <X size={20} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, flex: 1 }}>
        <Button
          fullWidth
          onClick={() => { setActiveTab('catalog'); setIsSidebarOpen(false); }}
          startIcon={<Smartphone size={18} />}
          sx={{
            justifyContent: 'flex-start',
            px: 2, py: 1.2,
            borderRadius: 2.5,
            backgroundColor: activeTab === 'catalog' ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
            color: activeTab === 'catalog' ? '#818cf8' : '#94a3b8',
            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#818cf8' },
          }}
        >
          <Box sx={{ flex: 1, textAlign: 'left' }}>Device Catalog</Box>
          <Chip label={modelsList.length} size="small" sx={{ height: 20, fontSize: '0.7rem', backgroundColor: 'rgba(255,255,255,0.1)' }} />
        </Button>

        <Button
          fullWidth
          onClick={() => { setActiveTab('colors'); setIsSidebarOpen(false); }}
          startIcon={<Palette size={18} />}
          sx={{
            justifyContent: 'flex-start',
            px: 2, py: 1.2,
            borderRadius: 2.5,
            backgroundColor: activeTab === 'colors' ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
            color: activeTab === 'colors' ? '#818cf8' : '#94a3b8',
            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#818cf8' },
          }}
        >
          Color Swatches
        </Button>

        <Button
          fullWidth
          onClick={() => { setActiveTab('variants'); setIsSidebarOpen(false); }}
          startIcon={<Layers size={18} />}
          sx={{
            justifyContent: 'flex-start',
            px: 2, py: 1.2,
            borderRadius: 2.5,
            backgroundColor: activeTab === 'variants' ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
            color: activeTab === 'variants' ? '#818cf8' : '#94a3b8',
            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#818cf8' },
          }}
        >
          Storage Variants
        </Button>

        <Button
          fullWidth
          onClick={() => { setActiveTab('brands'); setIsSidebarOpen(false); }}
          startIcon={<Sliders size={18} />}
          sx={{
            justifyContent: 'flex-start',
            px: 2, py: 1.2,
            borderRadius: 2.5,
            backgroundColor: activeTab === 'brands' ? 'rgba(99, 102, 241, 0.18)' : 'transparent',
            color: activeTab === 'brands' ? '#818cf8' : '#94a3b8',
            '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#818cf8' },
          }}
        >
          Brands & Series
        </Button>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleOpenAddModal}
          startIcon={<Plus size={18} />}
          sx={{ py: 1.2, fontWeight: 800 }}
        >
          Add New Device
        </Button>

        <Link href="/" style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#94a3b8', fontSize: '0.85rem', py: 0.5, '&:hover': { color: '#ffffff' } }}>
            <ArrowLeft size={16} /> Return to Storefront
          </Box>
        </Link>
      </Box>
    </Box>
  );

  return (
    <ThemeProvider theme={demonDarkTheme}>
      <CssBaseline />
      
      <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0f19', color: '#f1f5f9', overflowX: 'hidden' }}>
        
        {/* Permanent Sidebar for Desktop (1024px+) */}
        <Box
          component="aside"
          sx={{
            width: 270,
            flexShrink: 0,
            display: { xs: 'none', lg: 'block' },
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            zIndex: 100,
            backgroundColor: '#0f172a',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
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
              width: 270,
              boxSizing: 'border-box',
              borderRight: '1px solid rgba(255, 255, 255, 0.12)',
            },
          }}
        >
          {renderSidebarContent()}
        </Drawer>

        {/* Main Content Area Wrapper */}
        <Box
          sx={{
            flexGrow: 1,
            ml: { xs: 0, lg: '270px' },
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            width: { xs: '100%', lg: 'calc(100% - 270px)' },
          }}
        >
          
          {/* Material UI Sticky App Bar with Mobile Tabs */}
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              zIndex: 90,
            }}
          >
            <Toolbar
              variant="dense"
              sx={{
                minHeight: { xs: 46, sm: 54 },
                px: { xs: 1.5, sm: 2.5 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => setIsSidebarOpen(true)}
                  sx={{ display: { lg: 'none' }, color: '#ffffff', p: 0.5 }}
                  aria-label="Open Navigation Drawer"
                  size="small"
                >
                  <Menu size={20} />
                </IconButton>
                <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#ffffff', fontSize: { xs: '0.95rem', sm: '1.15rem' } }}>
                  Admin Panel
                </Typography>
                <Chip
                  label="IML"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)',
                    color: '#818cf8',
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                {/* Shorter Add Button */}
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={handleOpenAddModal}
                  startIcon={<Plus size={14} />}
                  sx={{
                    px: { xs: 1, sm: 1.5 },
                    py: 0.35,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    borderRadius: 2,
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
                    startIcon={<RotateCcw size={13} />}
                    sx={{
                      borderColor: 'rgba(255,255,255,0.18)',
                      color: '#cbd5e1',
                      px: { xs: 0.8, sm: 1.2 },
                      py: 0.35,
                      fontSize: '0.72rem',
                      minWidth: 'auto',
                      borderRadius: 2,
                    }}
                  >
                    Reset
                  </Button>
                </Tooltip>
              </Box>
            </Toolbar>

            {/* Mobile Material UI Tabs Bar (<1024px) for 1-touch tab navigation */}
            <Box sx={{ display: { xs: 'block', lg: 'none' }, borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <Tabs
                value={activeTab}
                onChange={(_, val) => setActiveTab(val)}
                variant="scrollable"
                scrollButtons={false}
                sx={{
                  minHeight: 38,
                  '& .MuiTabs-indicator': { backgroundColor: '#818cf8', height: 2.5 },
                }}
              >
                <Tab
                  label={`Devices (${modelsList.length})`}
                  value="catalog"
                  icon={<Smartphone size={14} />}
                  iconPosition="start"
                  sx={{ minHeight: 38, py: 0.5, px: 1.5, fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', '&.Mui-selected': { color: '#818cf8' } }}
                />
                <Tab
                  label="Colors"
                  value="colors"
                  icon={<Palette size={14} />}
                  iconPosition="start"
                  sx={{ minHeight: 38, py: 0.5, px: 1.5, fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', '&.Mui-selected': { color: '#818cf8' } }}
                />
                <Tab
                  label="Variants"
                  value="variants"
                  icon={<Layers size={14} />}
                  iconPosition="start"
                  sx={{ minHeight: 38, py: 0.5, px: 1.5, fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', '&.Mui-selected': { color: '#818cf8' } }}
                />
                <Tab
                  label="Brands"
                  value="brands"
                  icon={<Sliders size={14} />}
                  iconPosition="start"
                  sx={{ minHeight: 38, py: 0.5, px: 1.5, fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', '&.Mui-selected': { color: '#818cf8' } }}
                />
              </Tabs>
            </Box>
          </AppBar>

          {/* Inner Workspace Container */}
          <Box
            sx={{
              p: { xs: 1, sm: 2, md: 2.5 },
              maxWidth: 1350,
              width: '100%',
              mx: 'auto',
              boxSizing: 'border-box',
            }}
          >
            
            {/* High-Density Compact Filter & Hero Section */}
            <Card
              sx={{
                background: 'linear-gradient(135deg, #131b2e 0%, #0f172a 100%)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                borderRadius: { xs: 2.5, sm: 3.5 },
                p: { xs: 1.25, sm: 2 },
                mb: { xs: 1.5, sm: 2.5 },
              }}
            >
              {/* Compact Header Info & Reveal All Button */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: { xs: '0.85rem', sm: '1.1rem' } }}>
                    {activeTab === 'catalog' && `Device Catalog (${filteredModels.length})`}
                    {activeTab === 'colors' && 'Color Swatches'}
                    {activeTab === 'variants' && 'Storage & RAM Configurations'}
                    {activeTab === 'brands' && 'Brands & Series'}
                  </Typography>
                </Box>

                {activeTab === 'catalog' && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    {/* Shorter Reveal All Button */}
                    <Button
                      size="small"
                      variant="text"
                      onClick={handleToggleExpandAll}
                      sx={{
                        fontSize: '0.7rem',
                        py: 0.2,
                        px: 0.8,
                        minWidth: 'auto',
                        color: '#818cf8',
                        fontWeight: 700,
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        borderRadius: 1.5,
                      }}
                    >
                      {Object.values(expandedCardIds).some(Boolean) ? 'Hide All' : 'Reveal All'}
                    </Button>

                    {/* Grid / Table View Toggle */}
                    <Box
                      sx={{
                        display: 'flex',
                        backgroundColor: 'rgba(0, 0, 0, 0.35)',
                        border: '1px solid rgba(255, 255, 255, 0.12)',
                        borderRadius: 2,
                        p: 0.2,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => setViewMode('grid')}
                        sx={{
                          p: 0.4,
                          borderRadius: 1.5,
                          backgroundColor: viewMode === 'grid' ? '#6366f1' : 'transparent',
                          color: viewMode === 'grid' ? '#ffffff' : '#94a3b8',
                        }}
                        title="Grid View"
                      >
                        <LayoutGrid size={14} />
                      </IconButton>

                      <IconButton
                        size="small"
                        onClick={() => setViewMode('table')}
                        sx={{
                          p: 0.4,
                          borderRadius: 1.5,
                          backgroundColor: viewMode === 'table' ? '#6366f1' : 'transparent',
                          color: viewMode === 'table' ? '#ffffff' : '#94a3b8',
                        }}
                        title="Table View"
                      >
                        <List size={14} />
                      </IconButton>
                    </Box>
                  </Box>
                )}
              </Box>

              {/* High-Density Filters Row */}
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                
                {/* Search Field */}
                <Box sx={{ flex: 1, minWidth: { xs: '100%', sm: 180 } }}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search device name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search size={15} color="#94a3b8" style={{ marginRight: 6 }} />,
                      endAdornment: searchTerm ? (
                        <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ color: '#94a3b8', p: 0.3 }}>
                          <X size={14} />
                        </IconButton>
                      ) : null,
                      sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.35)',
                        borderRadius: 2,
                        fontSize: '0.8rem',
                        height: 34,
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                      },
                    }}
                  />
                </Box>

                {/* Brand & Series Select Filters */}
                <Box sx={{ display: 'flex', gap: 1, width: { xs: '100%', sm: 'auto' } }}>
                  <FormControl size="small" sx={{ flex: 1, minWidth: { xs: 0, sm: 130 } }}>
                    <Select
                      value={selectedBrandFilter}
                      onChange={(e) => {
                        setSelectedBrandFilter(e.target.value);
                        setSelectedSeriesFilter('all');
                      }}
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.35)',
                        borderRadius: 2,
                        fontSize: '0.78rem',
                        height: 34,
                        color: '#ffffff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
                      }}
                    >
                      <MenuItem value="all">All Brands</MenuItem>
                      {BRANDS.map((b) => (
                        <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ flex: 1, minWidth: { xs: 0, sm: 120 } }}>
                    <Select
                      value={selectedSeriesFilter}
                      onChange={(e) => setSelectedSeriesFilter(e.target.value)}
                      sx={{
                        backgroundColor: 'rgba(0, 0, 0, 0.35)',
                        borderRadius: 2,
                        fontSize: '0.78rem',
                        height: 34,
                        color: '#ffffff',
                        '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.12)' },
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

              {/* Horizontal Scrollable Brand Pills (Ultra Compact) */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 0.8,
                  overflowX: 'auto',
                  mt: 1.2,
                  pb: 0.2,
                  '&::-webkit-scrollbar': { height: 3 },
                  '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 3 },
                }}
              >
                <Chip
                  label={`All (${modelsList.length})`}
                  onClick={() => { setSelectedBrandFilter('all'); setSelectedSeriesFilter('all'); }}
                  color={selectedBrandFilter === 'all' ? 'secondary' : 'default'}
                  variant={selectedBrandFilter === 'all' ? 'filled' : 'outlined'}
                  size="small"
                  clickable
                  sx={{ height: 22, borderRadius: 3, fontWeight: 700, fontSize: '0.68rem', px: 0.5 }}
                />
                {BRANDS.map((b) => {
                  const count = modelsList.filter((m) => m.brandId === b.id).length;
                  const isSelected = selectedBrandFilter === b.id;
                  return (
                    <Chip
                      key={b.id}
                      label={`${b.name} (${count})`}
                      onClick={() => { setSelectedBrandFilter(b.id); setSelectedSeriesFilter('all'); }}
                      color={isSelected ? 'secondary' : 'default'}
                      variant={isSelected ? 'filled' : 'outlined'}
                      size="small"
                      clickable
                      sx={{ height: 22, borderRadius: 3, fontWeight: 600, fontSize: '0.68rem', px: 0.5, borderColor: isSelected ? undefined : 'rgba(255,255,255,0.12)' }}
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
                    {/* TABLE VIEW: Responsive Table Container */}
                    {viewMode === 'table' && (
                      <TableContainer
                        component={Paper}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.03)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          borderRadius: 4,
                          overflowX: 'auto',
                          mb: 3,
                        }}
                      >
                        <Table size="small" aria-label="Device Catalog Table" sx={{ minWidth: 650 }}>
                          <TableHead sx={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}>
                            <TableRow>
                              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>DEVICE</TableCell>
                              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>BRAND / SERIES</TableCell>
                              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>SWATCHES</TableCell>
                              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>CASH PRICE</TableCell>
                              <TableCell sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>24-MO EMI</TableCell>
                              <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.75rem' }}>ACTIONS</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {filteredModels.map((model) => {
                              const brand = BRANDS.find((b) => b.id === model.brandId);
                              const series = SERIES.find((s) => s.id === model.seriesId);
                              const monthly = Math.round(model.basePrice / 24);

                              return (
                                <TableRow key={model.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, borderColor: 'rgba(255,255,255,0.05)' }}>
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                      <Box
                                        component="img"
                                        src={model.image}
                                        alt={model.name}
                                        sx={{ width: 38, height: 38, objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: 2, p: 0.5 }}
                                      />
                                      <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.875rem' }}>
                                          {model.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>
                                          {model.specs.join(' • ')}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>

                                  <TableCell>
                                    <Typography variant="body2" sx={{ color: '#cbd5e1', fontWeight: 600, fontSize: '0.8rem' }}>
                                      {brand?.name}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#64748b', display: 'block', fontSize: '0.7rem' }}>
                                      {series?.name}
                                    </Typography>
                                  </TableCell>

                                  <TableCell>
                                    <Box sx={{ display: 'flex', gap: 0.6, alignItems: 'center' }}>
                                      {model.colors && model.colors.map((c, i) => (
                                        <Tooltip title={c.name} key={i} arrow>
                                          <Box
                                            sx={{
                                              width: 14,
                                              height: 14,
                                              borderRadius: '50%',
                                              backgroundColor: c.hex,
                                              border: '1px solid rgba(255,255,255,0.4)',
                                            }}
                                          />
                                        </Tooltip>
                                      ))}
                                    </Box>
                                  </TableCell>

                                  <TableCell sx={{ color: '#f43f5e', fontWeight: 800, fontSize: '0.85rem' }}>
                                    Rs. {model.basePrice.toLocaleString('en-PK')}
                                  </TableCell>

                                  <TableCell sx={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.8rem' }}>
                                    Rs. {monthly.toLocaleString('en-PK')}/mo
                                  </TableCell>

                                  <TableCell align="right">
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.8 }}>
                                      <Button
                                        size="small"
                                        onClick={() => handleOpenEditModal(model)}
                                        startIcon={<Edit3 size={14} />}
                                        sx={{
                                          fontSize: '0.725rem',
                                          py: 0.4,
                                          px: 1,
                                          backgroundColor: 'rgba(99, 102, 241, 0.15)',
                                          color: '#818cf8',
                                          '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.25)' },
                                        }}
                                      >
                                        Edit
                                      </Button>
                                      <Button
                                        size="small"
                                        onClick={() => handleDelete(model.id, model.name)}
                                        startIcon={<Trash2 size={14} />}
                                        sx={{
                                          fontSize: '0.725rem',
                                          py: 0.4,
                                          px: 1,
                                          backgroundColor: 'rgba(239, 68, 68, 0.15)',
                                          color: '#f87171',
                                          '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.25)' },
                                        }}
                                      >
                                        Delete
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

                    {/* GRID VIEW: Responsive Revealing System & Shorter Buttons */}
                    {viewMode === 'grid' && (
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            lg: 'repeat(3, 1fr)',
                          },
                          gap: 1.5,
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
                                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                border: isExpanded ? '1px solid rgba(99, 102, 241, 0.45)' : '1px solid rgba(255, 255, 255, 0.08)',
                                borderRadius: { xs: 2.5, sm: 3 },
                                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                                overflow: 'hidden',
                              }}
                            >
                              {/* Compact Primary Row (High Density) */}
                              <Box sx={{ p: { xs: 1.2, sm: 1.5 }, display: 'flex', alignItems: 'center', gap: 1.2 }}>
                                
                                {/* Device Thumbnail */}
                                <Box
                                  sx={{
                                    width: { xs: 38, sm: 44 },
                                    height: { xs: 38, sm: 44 },
                                    backgroundColor: '#ffffff',
                                    borderRadius: 2,
                                    p: 0.4,
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
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                                    <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                      {brand?.name} • {series?.name}
                                    </Typography>
                                    <Chip label="PTA" size="small" sx={{ height: 16, fontSize: '0.58rem', fontWeight: 700, backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }} />
                                  </Box>
                                  <Typography
                                    variant="subtitle2"
                                    sx={{
                                      fontWeight: 800,
                                      color: '#ffffff',
                                      fontSize: { xs: '0.85rem', sm: '0.92rem' },
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      lineHeight: 1.2,
                                      my: 0.2,
                                    }}
                                  >
                                    {model.name}
                                  </Typography>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, flexWrap: 'wrap' }}>
                                    <Typography variant="caption" sx={{ color: '#f43f5e', fontWeight: 900, fontSize: '0.78rem' }}>
                                      Rs. {model.basePrice.toLocaleString('en-PK')}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.72rem' }}>
                                      Rs. {monthly.toLocaleString('en-PK')}/mo
                                    </Typography>
                                  </Box>
                                </Box>

                                {/* Shorter Action Buttons */}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                  <Button
                                    size="small"
                                    onClick={() => handleOpenEditModal(model)}
                                    sx={{
                                      minWidth: 'auto',
                                      px: { xs: 0.8, sm: 1.2 },
                                      py: 0.3,
                                      fontSize: '0.7rem',
                                      color: '#818cf8',
                                      fontWeight: 700,
                                      backgroundColor: 'rgba(99, 102, 241, 0.12)',
                                      borderRadius: 1.5,
                                      '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.22)' }
                                    }}
                                  >
                                    Edit
                                  </Button>

                                  <Button
                                    size="small"
                                    onClick={() => handleDelete(model.id, model.name)}
                                    sx={{
                                      minWidth: 'auto',
                                      px: { xs: 0.8, sm: 1.2 },
                                      py: 0.3,
                                      fontSize: '0.7rem',
                                      color: '#f87171',
                                      fontWeight: 700,
                                      backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                      borderRadius: 1.5,
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
                                    endIcon={isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                    sx={{
                                      minWidth: 'auto',
                                      px: { xs: 0.9, sm: 1.2 },
                                      py: 0.3,
                                      fontSize: '0.7rem',
                                      borderRadius: 1.5,
                                      borderColor: isExpanded ? '#818cf8' : 'rgba(255, 255, 255, 0.15)',
                                      color: isExpanded ? '#818cf8' : '#cbd5e1',
                                      backgroundColor: isExpanded ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                                    }}
                                  >
                                    {isExpanded ? 'Hide' : 'Specs'}
                                  </Button>
                                </Box>
                              </Box>

                              {/* REVEALING SYSTEM: Collapsible Detailed Breakdown */}
                              <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />
                                <Box sx={{ p: { xs: 1.2, sm: 1.6 }, backgroundColor: 'rgba(0, 0, 0, 0.25)', display: 'flex', flexDirection: 'column', gap: 1 }}>
                                  
                                  {/* Specs tags */}
                                  <Box>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', display: 'block', mb: 0.4 }}>
                                      Specs & Warranty:
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                                      {model.specs.map((sp, i) => (
                                        <Chip key={i} label={sp} size="small" sx={{ height: 18, fontSize: '0.65rem', backgroundColor: 'rgba(255,255,255,0.06)', color: '#cbd5e1' }} />
                                      ))}
                                    </Box>
                                  </Box>

                                  {/* Color Swatches */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 0.8 }}>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase' }}>
                                      Color Options:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center' }}>
                                      {model.colors && model.colors.map((c, i) => (
                                        <Tooltip key={i} title={c.name} arrow>
                                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
                                            <Box sx={{ width: 13, height: 13, borderRadius: '50%', backgroundColor: c.hex, border: '1px solid rgba(255,255,255,0.4)' }} />
                                            <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '0.65rem' }}>{c.name}</Typography>
                                          </Box>
                                        </Tooltip>
                                      ))}
                                    </Box>
                                  </Box>

                                  {/* Storage Variants */}
                                  {model.storageOptions && model.storageOptions.length > 0 && (
                                    <Box>
                                      <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.65rem', textTransform: 'uppercase', display: 'block', mb: 0.4 }}>
                                        Storage Configurations:
                                      </Typography>
                                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {model.storageOptions.map((st, i) => (
                                          <Chip
                                            key={i}
                                            label={`${st.size} ${st.priceDelta > 0 ? `(+Rs. ${st.priceDelta.toLocaleString('en-PK')})` : '(Base)'}`}
                                            size="small"
                                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 600, backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}
                                          />
                                        ))}
                                      </Box>
                                    </Box>
                                  )}

                                  {/* Installment Plan Breakdown Grid */}
                                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0.6, backgroundColor: 'rgba(0, 0, 0, 0.35)', p: 0.8, borderRadius: 2 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.6rem', display: 'block', fontWeight: 700 }}>DOWN</Typography>
                                      <Typography variant="caption" sx={{ color: '#f1f5f9', fontSize: '0.7rem', fontWeight: 800 }}>Rs. {downP.toLocaleString('en-PK')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.6rem', display: 'block', fontWeight: 700 }}>12-MO</Typography>
                                      <Typography variant="caption" sx={{ color: '#38bdf8', fontSize: '0.7rem', fontWeight: 800 }}>Rs. {emi12.toLocaleString('en-PK')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.6rem', display: 'block', fontWeight: 700 }}>24-MO</Typography>
                                      <Typography variant="caption" sx={{ color: '#38bdf8', fontSize: '0.7rem', fontWeight: 800 }}>Rs. {emi24.toLocaleString('en-PK')}</Typography>
                                    </Box>
                                    <Box sx={{ textAlign: 'center' }}>
                                      <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.6rem', display: 'block', fontWeight: 700 }}>36-MO</Typography>
                                      <Typography variant="caption" sx={{ color: '#38bdf8', fontSize: '0.7rem', fontWeight: 800 }}>Rs. {emi36.toLocaleString('en-PK')}</Typography>
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
                  <Card sx={{ p: 5, textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 4 }}>
                    <Smartphone size={48} color="#64748b" style={{ marginBottom: 8 }} />
                    <Typography variant="h6" sx={{ color: '#cbd5e1', fontWeight: 700, mb: 2 }}>
                      No devices found matching your criteria.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenAddModal} startIcon={<Plus size={16} />}>
                      Add First Device
                    </Button>
                  </Card>
                )}
              </>
            )}

            {/* TAB 2: COLOR SWATCHES MANAGER */}
            {activeTab === 'colors' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
                  Global Color Variations Catalog
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                  {PRESET_COLORS.map((preset, idx) => {
                    const matchedModels = modelsList.filter((m) => m.colors?.some((c) => c.hex.toLowerCase() === preset.hex.toLowerCase()));
                    return (
                      <Card key={idx} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2.5, p: { xs: 1.25, sm: 1.75 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                          <Box sx={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: preset.hex, border: '2px solid rgba(255,255,255,0.4)', flexShrink: 0 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.82rem', lineHeight: 1.2 }}>{preset.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem' }}>{preset.hex}</Typography>
                          </Box>
                          <Chip label={`${matchedModels.length}`} size="small" color="secondary" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 800 }} />
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4, mt: 0.8 }}>
                          {matchedModels.length > 0 ? (
                            matchedModels.map((m) => (
                              <Chip key={m.id} label={m.name} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.62rem', color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.12)' }} />
                            ))
                          ) : (
                            <Typography variant="caption" sx={{ color: '#64748b', fontSize: '0.68rem' }}>No models assigned yet</Typography>
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
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
                  Storage & RAM Configurations Matrix
                </Typography>

                {isMobile ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
                    {modelsList.map((m) => (
                      <Card key={m.id} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 2.5, p: 1.25 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ color: '#ffffff', fontWeight: 800, fontSize: '0.85rem' }}>{m.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#f43f5e', fontWeight: 800, fontSize: '0.75rem' }}>
                              Base: Rs. {m.basePrice.toLocaleString('en-PK')}
                            </Typography>
                          </Box>
                          <Button size="small" onClick={() => handleOpenEditModal(m)} sx={{ color: '#818cf8', py: 0.25, px: 1, minWidth: 'auto', fontSize: '0.7rem', fontWeight: 700, backgroundColor: 'rgba(99, 102, 241, 0.12)', borderRadius: 1.5 }}>
                            Edit
                          </Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.6 }}>
                          {m.storageOptions?.map((st, i) => (
                            <Chip
                              key={i}
                              label={`${st.size} ${st.priceDelta > 0 ? `(+Rs. ${st.priceDelta.toLocaleString('en-PK')})` : '(Base)'}`}
                              size="small"
                              sx={{ height: 20, backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontSize: '0.68rem', fontWeight: 600 }}
                            />
                          ))}
                        </Box>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', overflowX: 'auto' }}>
                    <Table size="small" sx={{ minWidth: 550 }}>
                      <TableHead sx={{ backgroundColor: 'rgba(0,0,0,0.3)' }}>
                        <TableRow>
                          <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>DEVICE MODEL</TableCell>
                          <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>BASE CASH PRICE</TableCell>
                          <TableCell sx={{ color: '#94a3b8', fontWeight: 700 }}>AVAILABLE VARIANTS & DELTAS</TableCell>
                          <TableCell align="right" sx={{ color: '#94a3b8', fontWeight: 700 }}>ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {modelsList.map((m) => (
                          <TableRow key={m.id} hover>
                            <TableCell sx={{ color: '#ffffff', fontWeight: 800 }}>{m.name}</TableCell>
                            <TableCell sx={{ color: '#f43f5e', fontWeight: 700 }}>Rs. {m.basePrice.toLocaleString('en-PK')}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                                {m.storageOptions?.map((st, i) => (
                                  <Chip
                                    key={i}
                                    label={`${st.size} ${st.priceDelta > 0 ? `(+Rs. ${st.priceDelta.toLocaleString('en-PK')})` : '(Base)'}`}
                                    size="small"
                                    sx={{ backgroundColor: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', fontSize: '0.725rem' }}
                                  />
                                ))}
                              </Box>
                            </TableCell>
                            <TableCell align="right">
                              <Button size="small" onClick={() => handleOpenEditModal(m)} sx={{ color: '#818cf8', minWidth: 'auto', px: 1, py: 0.2, fontSize: '0.72rem' }}>Edit</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </Box>
            )}

            {/* TAB 4: BRANDS & SERIES STRUCTURE */}
            {activeTab === 'brands' && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#ffffff' }}>
                  Official Brand & Series Directory
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 1.5 }}>
                  {BRANDS.map((b) => {
                    const brandModels = modelsList.filter((m) => m.brandId === b.id);
                    const brandSeries = SERIES.filter((s) => s.brandId === b.id);

                    return (
                      <Card key={b.id} sx={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2.5, p: { xs: 1.25, sm: 1.75 } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1 }}>
                          <Box component="img" src={b.logoUrl} alt={b.name} sx={{ width: 32, height: 32, objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: 1.5, p: 0.4 }} />
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff', fontSize: '0.85rem' }}>{b.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.68rem' }}>{brandModels.length} Devices</Typography>
                          </Box>
                          <Button
                            size="small"
                            onClick={() => { setSelectedBrandFilter(b.id); setActiveTab('catalog'); }}
                            sx={{ minWidth: 'auto', px: 1, py: 0.3, fontSize: '0.7rem', fontWeight: 700, backgroundColor: 'rgba(99, 102, 241, 0.12)', color: '#818cf8', borderRadius: 1.5 }}
                          >
                            View
                          </Button>
                        </Box>

                        <Typography variant="caption" sx={{ color: '#818cf8', fontWeight: 700, fontSize: '0.65rem', display: 'block', mb: 0.4 }}>Series:</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.4 }}>
                          {brandSeries.map((s) => (
                            <Chip key={s.id} label={s.name} size="small" variant="outlined" sx={{ height: 18, fontSize: '0.65rem', color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.12)' }} />
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

        {/* Mobile Floating Action Button (FAB) - Compact */}
        <Fab
          color="primary"
          aria-label="Add Device"
          onClick={handleOpenAddModal}
          size={isMobile ? 'small' : 'medium'}
          sx={{
            position: 'fixed',
            bottom: { xs: 16, sm: 24 },
            right: { xs: 16, sm: 24 },
            display: { xs: 'flex', lg: 'none' },
            boxShadow: '0 8px 24px rgba(220, 38, 38, 0.5)',
            zIndex: 120,
          }}
        >
          <Plus size={isMobile ? 18 : 22} color="#ffffff" />
        </Fab>

        {/* Material UI Responsive Add/Edit Dialog Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fullWidth
          fullScreen={isMobile}
          maxWidth="sm"
          PaperProps={{
            sx: {
              backgroundColor: '#0f172a',
              backgroundImage: 'none',
              border: isMobile ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: isMobile ? 0 : 4,
              m: isMobile ? 0 : 2,
              maxHeight: isMobile ? '100%' : '85vh',
            },
          }}
        >
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 1, pt: isMobile ? 2 : 2.5, px: isMobile ? 2 : 3 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#ffffff', fontSize: { xs: '1.1rem', sm: '1.25rem' } }}>
                {editingModel ? `Edit ${editingModel.name}` : 'Add New Mobile Device'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                Configure specs, colors, storage variants, image source & prices.
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setIsModalOpen(false)} sx={{ color: '#94a3b8' }}>
              <X size={20} />
            </IconButton>
          </DialogTitle>

          <Box component="form" onSubmit={handleSaveModel} sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: 2, py: 2, px: isMobile ? 2 : 3, overflowY: 'auto', flex: 1 }}>
              
              {/* Brand & Series Responsive Selects */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                <FormControl size="small" fullWidth>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.5 }}>Brand *</Typography>
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
                    sx={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, color: '#ffffff' }}
                  >
                    {BRANDS.map((b) => (
                      <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" fullWidth>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.5 }}>Series *</Typography>
                  <Select
                    value={formData.seriesId}
                    onChange={(e) => setFormData({ ...formData, seriesId: e.target.value })}
                    sx={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, color: '#ffffff' }}
                  >
                    {SERIES.filter((s) => s.brandId === formData.brandId).map((s) => (
                      <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Model Name */}
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.5, display: 'block' }}>Device Model Name *</Typography>
                <TextField
                  fullWidth
                  size="small"
                  required
                  placeholder="S-25 Ultra 12/512 or iPhone 17 Pro"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  InputProps={{
                    sx: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, color: '#ffffff', fontSize: '0.875rem' }
                  }}
                />
              </Box>

              {/* Price & Image Source */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.5, display: 'block' }}>Base Cash Price (PKR) *</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    required
                    placeholder="128000"
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    InputProps={{
                      sx: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, color: '#ffffff', fontSize: '0.875rem' }
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.5, display: 'block' }}>Image Source / Logo URL</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="/samsung.svg or /apple.png"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    InputProps={{
                      sx: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, color: '#ffffff', fontSize: '0.875rem' }
                    }}
                  />
                </Box>
              </Box>

              {/* Image Preview Box */}
              {formData.image && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, backgroundColor: 'rgba(255,255,255,0.04)', p: 1, borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: '#94a3b8' }}>Preview:</Typography>
                  <Box component="img" src={formData.image} alt="Preview" sx={{ height: 34, objectFit: 'contain' }} />
                </Box>
              )}

              {/* Specs */}
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700, mb: 0.5, display: 'block' }}>Specs Tags (Comma-separated)</Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="8GB RAM, 256GB Storage, Official Warranty"
                  value={formData.specs}
                  onChange={(e) => setFormData({ ...formData, specs: e.target.value })}
                  InputProps={{
                    sx: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, color: '#ffffff', fontSize: '0.875rem' }
                  }}
                />
              </Box>

              {/* COLOR VARIATIONS MANAGER */}
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2.5, p: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Palette size={18} color="#818cf8" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff' }}>Color Variations</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5 }}>
                  {formData.colors.map((c, idx) => (
                    <Chip
                      key={idx}
                      avatar={<Box sx={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: c.hex, ml: '4px !important' }} />}
                      label={c.name}
                      onDelete={() => handleRemoveColorFromForm(idx)}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#ffffff', fontSize: '0.75rem' }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    placeholder="Color Name (Cobalt Blue)"
                    value={newColorName}
                    onChange={(e) => setNewColorName(e.target.value)}
                    sx={{ flex: { xs: '1 1 140px', sm: 1 }, '& input': { p: 0.8, fontSize: '0.8rem' } }}
                    InputProps={{ sx: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, color: '#ffffff' } }}
                  />
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      style={{ width: 36, height: 36, border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 4 }}
                    />
                    <Button size="small" variant="outlined" onClick={handleAddColorToForm} sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>
                      + Color
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* STORAGE & RAM VARIANTS MANAGER */}
              <Box sx={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2.5, p: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Layers size={18} color="#34d399" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#ffffff' }}>Storage Variants & Price Deltas</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5 }}>
                  {formData.storageOptions.map((st, idx) => (
                    <Chip
                      key={idx}
                      label={`${st.size} ${st.priceDelta > 0 ? `(+Rs. ${st.priceDelta.toLocaleString('en-PK')})` : '(Base)'}`}
                      onDelete={() => handleRemoveStorageFromForm(idx)}
                      size="small"
                      sx={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#34d399', fontSize: '0.75rem', fontWeight: 700 }}
                    />
                  ))}
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                  <TextField
                    size="small"
                    placeholder="Variant (12/512GB)"
                    value={newStorageSize}
                    onChange={(e) => setNewStorageSize(e.target.value)}
                    sx={{ flex: { xs: '1 1 120px', sm: 1 }, '& input': { p: 0.8, fontSize: '0.8rem' } }}
                    InputProps={{ sx: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, color: '#ffffff' } }}
                  />
                  <TextField
                    size="small"
                    type="number"
                    placeholder="+Delta"
                    value={newPriceDelta}
                    onChange={(e) => setNewPriceDelta(Number(e.target.value))}
                    sx={{ width: { xs: 85, sm: 100 }, '& input': { p: 0.8, fontSize: '0.8rem' } }}
                    InputProps={{ sx: { backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 2, color: '#ffffff' } }}
                  />
                  <Button size="small" variant="outlined" onClick={handleAddStorageToForm} sx={{ color: '#cbd5e1', borderColor: 'rgba(255,255,255,0.2)', whiteSpace: 'nowrap' }}>
                    + Variant
                  </Button>
                </Box>
              </Box>

            </DialogContent>

            <DialogActions sx={{ p: isMobile ? 1.5 : 2, borderColor: 'rgba(255,255,255,0.08)', backgroundColor: '#0f172a' }}>
              <Button onClick={() => setIsModalOpen(false)} size="small" sx={{ color: '#cbd5e1', fontSize: '0.78rem', minWidth: 'auto', px: 1.5 }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" size="small" sx={{ px: 2.5, py: 0.6, fontWeight: 800, fontSize: '0.78rem' }}>
                {editingModel ? 'Save' : 'Create'}
              </Button>
            </DialogActions>
          </Box>
        </Dialog>

        {/* Snackbar Toast Feedback */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
            sx={{ width: '100%', borderRadius: 2.5, fontWeight: 700 }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

      </Box>
    </ThemeProvider>
  );
}
