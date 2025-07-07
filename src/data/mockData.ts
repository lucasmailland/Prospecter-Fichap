// ========================================================================================
// DATOS MOCK CENTRALIZADOS - Evita hardcodeo en componentes
// ========================================================================================

import { Lead, User, LeadStatus, UserRole } from '@/types/common.types';

// ========================================================================================
// MOCK DATA - Para desarrollo y testing
// ========================================================================================

// Usuarios eliminados - NextAuth maneja autenticación real

// Mock leads para desarrollo
export const MOCK_LEADS: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'demo.user@example.com',
    company: 'TechCorp Inc.',
    jobTitle: 'CTO',
    phone: '+1 555-0123',
    score: 92,
    priority: 5,
    status: 'QUALIFIED' as LeadStatus,
    isEmailValid: true,
    isHighPriority: true,
    isReadyForContact: true,
    notes: 'Lead altamente calificado con presupuesto confirmado',
    createdAt: new Date('2024-01-15T10:30:00Z'),
    updatedAt: new Date('2024-01-15T14:20:00Z'),
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@startupxyz.com',
    company: 'StartupXYZ',
    jobTitle: 'Founder & CEO',
    phone: '+1 555-0456',
    score: 87,
    priority: 4,
    status: 'QUALIFIED' as LeadStatus,
    isEmailValid: true,
    isHighPriority: true,
    isReadyForContact: true,
    notes: 'Startup en crecimiento, necesita solución escalable',
    createdAt: new Date('2024-01-14T15:45:00Z'),
    updatedAt: new Date('2024-01-15T09:10:00Z'),
  },
  {
    id: '3',
    name: 'Emma Davis',
    email: 'emma.davis@enterprise.com',
    company: 'Enterprise Solutions',
    jobTitle: 'VP Engineering',
    phone: '+1 555-0789',
    score: 94,
    priority: 5,
    status: 'QUALIFIED' as LeadStatus,
    isEmailValid: true,
    isHighPriority: true,
    isReadyForContact: true,
    notes: 'Empresa consolidada, busca modernizar stack',
    createdAt: new Date('2024-01-13T08:15:00Z'),
    updatedAt: new Date('2024-01-14T16:30:00Z'),
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james@innovatelab.com',
    company: 'InnovateLab',
    jobTitle: 'Tech Director',
    phone: '+1 555-0321',
    score: 76,
    priority: 3,
    status: 'POTENTIAL' as LeadStatus,
    isEmailValid: true,
    isHighPriority: false,
    isReadyForContact: true,
    notes: 'Mostró interés, pendiente de demo',
    createdAt: new Date('2024-01-12T11:20:00Z'),
    updatedAt: new Date('2024-01-13T13:45:00Z'),
  },
  {
    id: '5',
    name: 'Lisa Rodriguez',
    email: 'lisa.rodriguez@healthtech.io',
    company: 'HealthTech Solutions',
    jobTitle: 'Product Manager',
    phone: '+1 555-0654',
    score: 88,
    priority: 4,
    status: 'QUALIFIED' as LeadStatus,
    isEmailValid: true,
    isHighPriority: true,
    isReadyForContact: true,
    notes: 'Referido por cliente actual',
    createdAt: new Date('2024-01-11T14:10:00Z'),
    updatedAt: new Date('2024-01-12T10:25:00Z'),
  },
];

export const MOCK_USER: User = {
  id: '1',
  name: 'Lucas Mailland',
  email: 'lucas@prospecter.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  role: 'ADMIN' as UserRole,
  lastLogin: new Date('2024-01-15T14:30:00Z'),
};

// ========================================================================================
// STATS MOCK
// ========================================================================================

export const MOCK_DASHBOARD_STATS = [
  {
    title: 'Total Leads',
    value: '2,847',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: 'users',
  },
  {
    title: 'Score Promedio',
    value: '84',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: 'chart',
  },
  {
    title: 'Conversión',
    value: '28.4%',
    change: '+3.1%',
    changeType: 'positive' as const,
    icon: 'trending-up',
  },
  {
    title: 'Revenue',
    value: '$2,156',
    change: '-2.4%',
    changeType: 'negative' as const,
    icon: 'currency',
  },
];

export const MOCK_RECENT_LEADS = [
  {
    name: 'Sarah Johnson',
    company: 'TechCorp Inc.',
    score: 92,
    status: 'QUALIFIED' as LeadStatus,
    email: 'sarah@techcorp.com',
    addedAt: '2 min ago',
  },
  {
    name: 'Michael Chen',
    company: 'StartupXYZ',
    score: 87,
    status: 'QUALIFIED' as LeadStatus,
    email: 'michael@startupxyz.com',
    addedAt: '15 min ago',
  },
  {
    name: 'Emma Davis',
    company: 'Enterprise Solutions',
    score: 94,
    status: 'QUALIFIED' as LeadStatus,
    email: 'emma@enterprise.com',
    addedAt: '1 hour ago',
  },
  {
    name: 'James Wilson',
    company: 'InnovateLab',
    score: 76,
    status: 'POTENTIAL' as LeadStatus,
    email: 'james@innovatelab.com',
    addedAt: '2 hours ago',
  },
];

export const MOCK_SCORE_DISTRIBUTION = [
  { range: '90-100', count: 456, percentage: 68, status: 'excellent' },
  { range: '80-89', count: 234, percentage: 35, status: 'good' },
  { range: '70-79', count: 123, percentage: 18, status: 'fair' },
  { range: '60-69', count: 89, percentage: 13, status: 'fair' },
  { range: '<60', count: 45, percentage: 7, status: 'poor' },
];

// ========================================================================================
// NOTIFICACIONES MOCK
// ========================================================================================

export const MOCK_NOTIFICATIONS = {
  count: 3,
  items: [
    {
      id: '1',
      title: 'Nuevo lead calificado',
      message: 'Sarah Johnson ha sido marcada como lead de alta prioridad',
      time: '5 min ago',
      read: false,
    },
    {
      id: '2',
      title: 'Enriquecimiento completado',
      message: '25 leads han sido procesados exitosamente',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      title: 'Actualización del sistema',
      message: 'Nueva versión disponible con mejoras de rendimiento',
      time: '2 hours ago',
      read: true,
    },
  ],
};

// ========================================================================================
// HELPERS
// ========================================================================================

export const getRandomLead = (): typeof MOCK_LEADS[0] => {
  return MOCK_LEADS[Math.floor(Math.random() * MOCK_LEADS.length)];
};

export const getLeadsByStatus = (status: string) => {
  if (status === 'all') return MOCK_LEADS;
  return MOCK_LEADS.filter(lead => lead.status === status);
};

export function filterLeads(leads: Lead[], filters: {
  status?: string;
  priority?: number;
  search?: string;
}): Lead[] {
  return leads.filter(lead => {
    // Filtro por status
    if (filters.status && lead.status !== filters.status) {
      return false;
    }
    
    // Filtro por prioridad
    if (filters.priority !== undefined && lead.priority < filters.priority) {
      return false;
    }
    
    // Filtro por búsqueda
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const searchFields = [
        lead.name,
        lead.email,
        lead.company,
        lead.jobTitle,
        lead.notes
      ].filter(Boolean); // Eliminar undefined/null
      
      const matchesSearch = searchFields.some(field => 
        field && field.toLowerCase().includes(searchLower)
      );
      
      if (!matchesSearch) {
        return false;
      }
    }
    
    return true;
  });
}

export function searchLeads(leads: Lead[], query: string): Lead[] {
  if (!query.trim()) return leads;
  
  const lowerQuery = query.toLowerCase();
  return leads.filter(lead =>
    (lead.firstName && lead.firstName.toLowerCase().includes(lowerQuery)) ||
    (lead.lastName && lead.lastName.toLowerCase().includes(lowerQuery)) ||
    lead.email.toLowerCase().includes(lowerQuery) ||
    lead.company?.toLowerCase().includes(lowerQuery) ||
    lead.jobTitle?.toLowerCase().includes(lowerQuery)
  );
} 