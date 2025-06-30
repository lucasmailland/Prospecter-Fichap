'use client';

import Layout from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  UsersIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  SparklesIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  ArrowUpIcon,
} from '@heroicons/react/24/outline';
import StatCard from '@/components/dashboard/StatCard';
import Illustration from '@/components/ui/Illustration';
import { designSystem } from '@/styles/design-system';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Stats reales para prospectación
  const stats = [
    {
      title: 'Total Leads',
      value: '2,847',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <UsersIcon className="h-4 w-4" />,
    },
    {
      title: 'Score Promedio',
      value: '84',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <ChartBarIcon className="h-4 w-4" />,
    },
    {
      title: 'Conversión',
      value: '28.4%',
      change: '+3.1%',
      changeType: 'positive' as const,
      icon: <ArrowTrendingUpIcon className="h-4 w-4" />,
    },
    {
      title: 'Revenue',
      value: '$2,156',
      change: '-2.4%',
      changeType: 'negative' as const,
      icon: <CurrencyDollarIcon className="h-4 w-4" />,
    },
  ];

  // Leads recientes enriquecidos
  const recentLeads = [
    {
      name: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      score: 92,
      status: 'qualified',
      email: 'sarah@techcorp.com',
      addedAt: '2 min ago',
    },
    {
      name: 'Michael Chen',
      company: 'StartupXYZ',
      score: 87,
      status: 'qualified',
      email: 'michael@startupxyz.com',
      addedAt: '15 min ago',
    },
    {
      name: 'Emma Davis',
      company: 'Enterprise Solutions',
      score: 94,
      status: 'qualified',
      email: 'emma@enterprise.com',
      addedAt: '1 hour ago',
    },
    {
      name: 'James Wilson',
      company: 'InnovateLab',
      score: 76,
      status: 'potential',
      email: 'james@innovatelab.com',
      addedAt: '2 hours ago',
    },
  ];

  const scoreDistribution = [
    { range: '90-100', count: 456, percentage: 68, status: 'excellent' },
    { range: '80-89', count: 234, percentage: 35, status: 'good' },
    { range: '70-79', count: 123, percentage: 18, status: 'fair' },
    { range: '60-69', count: 89, percentage: 13, status: 'fair' },
    { range: '<60', count: 45, percentage: 7, status: 'poor' },
  ];

  const performanceMetrics = {
    successRate: 96.2,
    avgProcessingTime: '2.3s',
    totalProcessed: '12,847',
    errors: 23,
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return designSystem.score.excellent;
    if (score >= 60) return designSystem.score.good;
    if (score >= 40) return designSystem.score.fair;
    return designSystem.score.poor;
  };

  const getStatusStyles = (status: string) => {
    const statusMap = {
      'qualified': designSystem.leadStatus.qualified,
      'potential': designSystem.leadStatus.potential,
      'cold': designSystem.leadStatus.cold,
    };
    return statusMap[status as keyof typeof statusMap] || designSystem.leadStatus.cold;
  };

  const getDistributionColor = (status: string) => {
    const colorMap = {
      'excellent': designSystem.progressBar.excellent,
      'good': designSystem.progressBar.good, 
      'fair': designSystem.progressBar.fair,
      'poor': designSystem.progressBar.poor,
    };
    return colorMap[status as keyof typeof colorMap] || designSystem.progressBar.neutral;
  };

  return (
    <Layout>
      <div className={designSystem.spacing.section}>
        {/* Header minimalista */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b border-gray-100 dark:border-gray-800 pb-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className={designSystem.typography.h1}>Dashboard</h1>
              <p className={`${designSystem.typography.body} mt-1`}>
                Resumen de actividad de enriquecimiento
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-md">
                {['7d', '30d', '90d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      selectedPeriod === period
                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid minimalista */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts compactos */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Score Distribution */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`xl:col-span-1 ${designSystem.card.base}`}
          >
            <div className={`${designSystem.spacing.cardHeader} border-b border-gray-100 dark:border-gray-700`}>
              <h3 className={designSystem.typography.h2}>Distribución de Scores</h3>
              <p className={`${designSystem.typography.body} mt-0.5`}>Análisis de calidad</p>
            </div>
            <div className={designSystem.spacing.cardContent}>
              <div className={designSystem.spacing.item}>
                {scoreDistribution.map((item, index) => (
                  <motion.div
                    key={item.range}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-1.5"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${getDistributionColor(item.status)}`}></div>
                        <span className={designSystem.typography.body}>{item.range}</span>
                      </div>
                      <span className={designSystem.typography.h3}>{item.count}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1">
                      <div 
                        className={`h-1 rounded-full transition-all duration-1000 ${getDistributionColor(item.status)}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Leads compacto */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`xl:col-span-2 ${designSystem.card.base}`}
          >
            <div className={`${designSystem.spacing.cardHeader} border-b border-gray-100 dark:border-gray-700`}>
              <h3 className={designSystem.typography.h2}>Leads Recientes</h3>
              <p className={`${designSystem.typography.body} mt-0.5`}>Últimos agregados</p>
            </div>
            <div className={designSystem.spacing.cardContent}>
              <div className="space-y-0">
                {recentLeads.map((lead, index) => (
                  <motion.div
                    key={lead.email}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-b-0 ${designSystem.card.interactive} -mx-5 px-5`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <div className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        <span className={`${designSystem.typography.caption} text-[10px]`}>
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className={designSystem.typography.h3}>{lead.name}</div>
                        <div className={`${designSystem.typography.caption} text-[10px]`}>{lead.company}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <div className={`text-sm ${getScoreColor(lead.score)}`}>{lead.score}</div>
                        <div className={`${designSystem.typography.caption} text-[9px]`}>score</div>
                      </div>
                      <span className={`px-2 py-0.5 text-[10px] font-medium rounded ${getStatusStyles(lead.status).bg} ${getStatusStyles(lead.status).text}`}>
                        {lead.status}
                      </span>
                      <div className={`flex items-center space-x-1 ${designSystem.typography.caption} text-[10px]`}>
                        <ClockIcon className="h-2.5 w-2.5" />
                        <span>{lead.addedAt}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Performance Panel compacto */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={designSystem.card.base}
        >
          <div className={`${designSystem.spacing.cardHeader} border-b border-gray-100 dark:border-gray-700`}>
            <h3 className={designSystem.typography.h2}>Rendimiento</h3>
            <p className={`${designSystem.typography.body} mt-0.5`}>Métricas en tiempo real</p>
          </div>
          <div className={designSystem.spacing.cardContent}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`${designSystem.typography.metric} ${designSystem.score.excellent} mb-0.5`}>
                  {performanceMetrics.successRate}%
                </div>
                <div className={designSystem.typography.body}>Tasa de éxito</div>
              </div>
              <div className="text-center">
                <div className={`${designSystem.typography.metric} mb-0.5`}>
                  {performanceMetrics.avgProcessingTime}
                </div>
                <div className={designSystem.typography.body}>Tiempo promedio</div>
              </div>
              <div className="text-center">
                <div className={`${designSystem.typography.metric} mb-0.5`}>
                  {performanceMetrics.totalProcessed}
                </div>
                <div className={designSystem.typography.body}>Total procesados</div>
              </div>
              <div className="text-center">
                <div className={`${designSystem.typography.metric} ${performanceMetrics.errors > 20 ? designSystem.score.fair : designSystem.score.good} mb-0.5`}>
                  {performanceMetrics.errors}
                </div>
                <div className={designSystem.typography.body}>Errores</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
} 