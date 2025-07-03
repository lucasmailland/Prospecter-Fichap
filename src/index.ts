// ========================================================================================
// EXPORTS CENTRALIZADOS - Punto de entrada único para todos los componentes
// ========================================================================================

// Componentes de UI básicos
export { default as LoadingScreen } from './components/ui/LoadingScreen';
export { default as LoadingState } from './components/ui/LoadingState';
export { default as Modal } from './components/ui/Modal';
export { default as Dropdown } from './components/ui/Dropdown';
export { default as Toast } from './components/ui/Toast';
export { default as Illustration } from './components/ui/Illustration';

// Componentes de layout
export { default as Layout } from './components/layout/Layout';
export { default as Navbar } from './components/layout/Navbar';

// Componentes de autenticación
export { default as TwoFAModal } from './components/auth/TwoFAModal';

// Componentes de formularios
export { default as LeadForm } from './components/forms/LeadForm';

// Componentes de tabla (solo HeroUI)
export { HeroUILeadsTable } from './components/table/HeroUILeadsTable';

// Componentes de leads
export { default as LeadDetailsModal } from './components/leads/LeadDetailsModal';

// Componentes de dashboard
export { default as StatCard } from './components/dashboard/StatCard';

// Componentes de configuración
export { default as TeamManagement } from './components/settings/TeamManagement';

// Componentes comunes
export { default as ErrorBoundary } from './components/common/ErrorBoundary';

// Hooks
export { default as useAsyncOperation } from './hooks/common/useAsyncOperation';
export { default as useClickOutside } from './hooks/common/useClickOutside';
export { default as useForm } from './hooks/common/useForm';
export { default as useLocalStorage } from './hooks/common/useLocalStorage';
export { default as useLeads } from './hooks/useLeads';
export { default as useEnrichment } from './hooks/useEnrichment';

// Servicios
export { default as apiService } from './services/api.service';
export { default as enrichmentService } from './services/enrichment.service';
export { default as leadsService } from './services/leads.service';
export { hubspotService } from './services/hubspot.service';
export { aiAnalysisService } from './services/aiAnalysis.service';
export { leadScoringService } from './services/leadScoring.service';

// Utilidades
export * from './utils/performance';
export * from './utils/sanitizer';

// Contextos
export { AuthProvider, useAuth } from './contexts/AuthContext';

// Constantes
export * from './constants/navigation';

// Tipos
export * from './types/common.types';
export * from './types/api.types';
export * from './types/hubspot.types';
export * from './types/table.types';

// Estilos
export * from './styles/design-system';

// Datos mock (solo para desarrollo)
export * from './data/mockData';

// Loading System
export { default as LoadingSystem, LoadingSpinner, LoadingDots, LoadingSkeleton, useLoading, useAsyncLoading } from './components/ui/LoadingSystem'; 