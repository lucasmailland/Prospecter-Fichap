import type {SVGProps} from "react";
import { Lead, LeadStatus, LeadSource } from './common.types';

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// ========================================================================================
// TABLE TYPES - Tipos específicos para tablas de HeroUI
// ========================================================================================

// Tipos específicos para la tabla de leads
export type TableDensity = "compact" | "normal" | "comfortable";
export type TableView = "table" | "grid";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// Configuración de ordenamiento
export interface SortConfig {
  key: keyof Lead | null;
  direction: 'asc' | 'desc';
}

// Filtros por columna
export interface ColumnFilter {
  [key: string]: string;
}

// Tipos para el sistema de leads con HeroUI
export type LeadStatusFilter = LeadStatus | "all";
export type LeadSourceFilter = LeadSource | "all";

// Configuración de la tabla de leads
export interface LeadsTableConfig {
  density: TableDensity;
  view: TableView;
  visibleColumns: Set<string>;
  sortConfig: SortConfig;
  filters: {
    global: string;
    status: LeadStatusFilter;
    source: LeadSourceFilter;
    columns: ColumnFilter;
  };
  pagination: {
    page: number;
    itemsPerPage: number;
  };
}

// Tipos para acciones masivas
export type BulkAction = 
  | 'mark-contacted'
  | 'mark-qualified' 
  | 'change-priority'
  | 'export-csv'
  | 'copy-data'
  | 'delete-leads';

// Tipos para exportación
export type ExportFormat = "csv" | "excel" | "pdf" | "json";

export interface ExportOptions {
  format: ExportFormat;
  includeHeaders: boolean;
  selectedOnly: boolean;
  columns: string[];
}

// Datos enriquecidos para la tabla
export interface EnrichedLead extends Lead {
  // Datos adicionales calculados para la tabla
  displayName: string;
  statusLabel: string;
  scoreCategory: 'HOT' | 'WARM' | 'COLD' | 'LOW';
  priorityLabel: string;
  sourceLabel: string;
  
  // Datos de HubSpot si están disponibles
  hubspot?: {
    contactId: string;
    emailMetrics: {
      emailsSent: number;
      emailsOpened: number;
      openRate: number;
      clickRate: number;
    };
    conversationsCount: number;
    lastActivity?: Date;
  };
  
  // Análisis de IA si está disponible
  aiAnalysis?: {
    sentimentScore: number;
    buyingSignals: string[];
    recommendedActions: string[];
    conversionProbability: number;
  };
  
  // Scoring detallado
  scoring?: {
    totalScore: number;
    category: string;
    factors: {
      icp: number;
      ai: number;
      engagement: number;
      dataQuality: number;
    };
  };
}

// Props para el componente de tabla
export interface TableProps {
  leads: Lead[];
  loading?: boolean;
  error?: string | null;
  config: LeadsTableConfig;
  onConfigChange: (config: Partial<LeadsTableConfig>) => void;
  onLeadSelect?: (lead: Lead) => void;
  onLeadEdit?: (lead: Lead) => void;
  onLeadDelete?: (lead: Lead) => void;
  onBulkAction?: (action: BulkAction, leads: Lead[]) => void;
  onRefresh?: () => void;
}
