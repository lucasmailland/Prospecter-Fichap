// Design System Centralizado - Estética Superhuman ULTRA MINIMALISTA
export const designSystem = {
  // Espaciado minimalista
  spacing: {
    card: 'p-5',           // Más compacto
    cardHeader: 'px-5 pt-5 pb-3',  // Header más compacto
    cardContent: 'p-5',    // Contenido más compacto
    section: 'space-y-5',  // Separación más compacta
    item: 'space-y-3',     // Separación entre items compacta
  },

  // Tipografía minimalista
  typography: {
    h1: 'text-xl font-medium text-gray-900 dark:text-white tracking-tight',
    h2: 'text-base font-medium text-gray-900 dark:text-white tracking-tight',
    h3: 'text-sm font-medium text-gray-900 dark:text-white',
    body: 'text-xs text-gray-500 dark:text-gray-400 font-normal',
    caption: 'text-xs text-gray-400 dark:text-gray-500',
    value: 'text-lg font-medium text-gray-900 dark:text-white tracking-tight',
    metric: 'text-2xl font-medium text-gray-900 dark:text-white tracking-tight',
  },

  // Sistema de colores SÚPER VISIBLES pero minimalistas
  colors: {
    success: {
      bg: 'bg-green-50 dark:bg-green-950/20',
      border: 'border-green-200 dark:border-green-800/30',
      text: 'text-green-800 dark:text-green-300',
      icon: 'text-green-700 dark:text-green-400',
      dot: 'bg-green-600',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-950/20',
      border: 'border-yellow-200 dark:border-yellow-800/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      icon: 'text-yellow-700 dark:text-yellow-400',
      dot: 'bg-yellow-600',
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-950/20',
      border: 'border-red-200 dark:border-red-800/30', 
      text: 'text-red-800 dark:text-red-300',
      icon: 'text-red-700 dark:text-red-400',
      dot: 'bg-red-600',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      border: 'border-blue-200 dark:border-blue-800/30',
      text: 'text-blue-800 dark:text-blue-300', 
      icon: 'text-blue-700 dark:text-blue-400',
      dot: 'bg-blue-600',
    },
    neutral: {
      bg: 'bg-gray-50 dark:bg-gray-800',
      border: 'border-gray-100 dark:border-gray-700',
      text: 'text-gray-600 dark:text-gray-300',
      icon: 'text-gray-400 dark:text-gray-500',
      dot: 'bg-gray-300 dark:bg-gray-600',
    }
  },

  // Cards súper minimalistas
  card: {
    base: 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-md',
    hover: 'hover:shadow-sm transition-shadow duration-200',
    interactive: 'hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors',
  },

  // Botones minimalistas
  button: {
    primary: 'px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-md text-sm font-medium transition-colors',
    secondary: 'px-3 py-2 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md text-sm font-medium transition-colors',
    ghost: 'px-2 py-1 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm font-medium transition-colors',
  },

  // Inputs minimalistas
  input: {
    base: 'w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors',
  },

  // Métricas SÚPER VISIBLES
  metrics: {
    positive: 'text-green-700 dark:text-green-400 font-bold',
    negative: 'text-red-700 dark:text-red-400 font-bold',
    neutral: 'text-gray-500 dark:text-gray-400 font-medium',
  },

  // Status SÚPER VISIBLES pero minimalistas
  leadStatus: {
    qualified: {
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-900 dark:text-green-200',
      dot: 'bg-green-600',
    },
    potential: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
      text: 'text-yellow-900 dark:text-yellow-200',
      dot: 'bg-yellow-600',
    },
    cold: {
      bg: 'bg-gray-100 dark:bg-gray-700',
      text: 'text-gray-600 dark:text-gray-300',
      dot: 'bg-gray-400',
    },
    hot: {
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-900 dark:text-red-200', 
      dot: 'bg-red-600',
    },
    warm: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-900 dark:text-orange-200',
      dot: 'bg-orange-600',
    }
  },

  // Scores SÚPER VISIBLES
  score: {
    excellent: 'text-green-700 dark:text-green-400 font-bold', // 80+
    good: 'text-blue-700 dark:text-blue-400 font-bold',        // 60-79
    fair: 'text-yellow-700 dark:text-yellow-400 font-bold',    // 40-59
    poor: 'text-red-700 dark:text-red-400 font-bold',          // <40
  },

  // Progress bars SÚPER VISIBLES
  progressBar: {
    excellent: 'bg-green-600',
    good: 'bg-blue-600', 
    fair: 'bg-yellow-600',
    poor: 'bg-red-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
    neutral: 'bg-gray-300',
  }
};

// Funciones helper
export const getStatusStyles = (status: string) => {
  const statusMap: Record<string, keyof typeof designSystem.leadStatus> = {
    'qualified': 'qualified',
    'potential': 'potential', 
    'cold': 'cold',
    'hot': 'hot',
    'warm': 'warm',
  };
  
  return designSystem.leadStatus[statusMap[status]] || designSystem.leadStatus.cold;
};

export const getScoreStyles = (score: number) => {
  if (score >= 80) return designSystem.score.excellent;
  if (score >= 60) return designSystem.score.good;
  if (score >= 40) return designSystem.score.fair;
  return designSystem.score.poor;
};

export const getMetricStyles = (changeType: 'positive' | 'negative' | 'neutral') => {
  return designSystem.metrics[changeType];
};

export const getProgressBarColor = (type: string) => {
  const progressMap: Record<string, keyof typeof designSystem.progressBar> = {
    'excellent': 'excellent',
    'good': 'good',
    'fair': 'fair', 
    'poor': 'poor',
    'up': 'success',
    'down': 'danger',
    'stable': 'neutral',
  };
  
  return designSystem.progressBar[progressMap[type]] || designSystem.progressBar.neutral;
}; 