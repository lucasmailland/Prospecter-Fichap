import {
  HomeIcon,
  UsersIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  SparklesIcon,
  CloudIcon,
} from '@heroicons/react/24/outline';

import { 
  Home, 
  Users, 
  BarChart3, 
  Settings, 
  Database, 
  Brain,
  Target,
  CheckSquare,
  Globe
} from 'lucide-react';

// ========================================================================================
// CONFIGURACIÓN DE NAVEGACIÓN CENTRALIZADA
// ========================================================================================

export const NAVIGATION_ITEMS = [
  { 
    name: 'Dashboard', 
    href: '/', 
    icon: HomeIcon,
    description: 'Resumen de actividad de enriquecimiento'
  },
  { 
    name: 'Leads', 
    href: '/leads', 
    icon: UsersIcon,
    description: 'Gestión de leads y prospects'
  },
  { 
    name: 'Task Management',
    href: '/tasks',
    icon: CheckSquare,
    description: 'Gestión de tareas con IA y validación'
  },
  { 
    name: 'HubSpot', 
    href: '/hubspot', 
    icon: CloudIcon,
    description: 'Integración y sincronización de HubSpot'
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: ChartBarIcon,
    description: 'Análisis detallado del rendimiento'
  },
  { 
    name: 'AI Assistant', 
    href: '/ai', 
    icon: SparklesIcon,
    description: 'Asistente IA, generación de contenido y análisis inteligente'
  },
  { 
    name: 'Configuración', 
    href: '/settings', 
    icon: Cog6ToothIcon,
    description: 'Configuración de la aplicación',
    children: [
      {
        name: 'General',
        href: '/settings',
        icon: Cog6ToothIcon,
      },
      {
        name: 'Seguridad',
        href: '/settings/security',
        icon: Cog6ToothIcon,
      },
    ],
  },
] as const;

export const getPageInfo = (pathname: string) => {
  // const _page = NAVIGATION_ITEMS.find(item => item.href === pathname);
  return {
    title: page?.name || 'Prospecter',
    description: page?.description || 'Sistema de prospectación inteligente'
  };
};

export const adminNavigationItems = [
  {
    name: 'Security',
    href: '/settings/security',
    icon: Cog6ToothIcon,
    description: 'Configuración de seguridad'
  }
];

export const navigationItems = [
  {
    name: 'Dashboard',
    href: '/',
    icon: Home,
    description: 'Vista general del sistema'
  },
  {
    name: 'Leads',
    href: '/leads',
    icon: Users,
    description: 'Gestión de leads y prospección'
  },
  {
    name: 'Task Management',
    href: '/tasks',
    icon: CheckSquare,
    description: 'Gestión de tareas con IA y validación'
  },
  {
    name: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Métricas y análisis de rendimiento'
  },
  {
    name: 'AI Assistant',
    href: '/ai',
    icon: Brain,
    description: 'Asistente de IA para prospección'
  },
  {
    name: 'HubSpot',
    href: '/hubspot',
    icon: Globe,
    description: 'Integración y sincronización de HubSpot'
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Configuración del sistema'
  }
];
