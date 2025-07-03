'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoadingSystem from '@/components/ui/LoadingSystem';
import StatCard from '@/components/dashboard/StatCard';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  FunnelIcon,
  SparklesIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

const timeRanges = [
  { value: '7d', label: '7 días' },
  { value: '30d', label: '30 días' },
  { value: '90d', label: '90 días' },
  { value: '1y', label: '1 año' },
];

const sourceData = [
  { name: 'LinkedIn', leads: 1247, conversion: 34.2, revenue: 8950, color: 'bg-blue-500' },
  { name: 'Email Campaigns', leads: 892, conversion: 28.7, revenue: 6240, color: 'bg-green-500' },
  { name: 'Web Forms', leads: 456, conversion: 45.1, revenue: 4180, color: 'bg-purple-500' },
  { name: 'Cold Outreach', leads: 234, conversion: 12.8, revenue: 1890, color: 'bg-orange-500' },
  { name: 'Referrals', leads: 123, conversion: 67.9, revenue: 3240, color: 'bg-pink-500' },
];

const industryData = [
  { name: 'Technology', count: 847, percentage: 32.1, growth: '+12.3%' },
  { name: 'Finance', count: 623, percentage: 23.6, growth: '+8.7%' },
  { name: 'Healthcare', count: 456, percentage: 17.3, growth: '+15.2%' },
  { name: 'Education', count: 234, percentage: 8.9, growth: '+5.1%' },
  { name: 'Retail', count: 198, percentage: 7.5, growth: '+22.4%' },
  { name: 'Others', count: 289, percentage: 10.6, growth: '+3.8%' },
];

const performanceMetrics = [
  { metric: 'Response Rate', value: '34.2%', change: '+5.3%', trend: 'up' },
  { metric: 'Email Open Rate', value: '68.7%', change: '+2.1%', trend: 'up' },
  { metric: 'Click Through Rate', value: '12.4%', change: '-1.2%', trend: 'down' },
  { metric: 'Meeting Booking Rate', value: '8.9%', change: '+3.4%', trend: 'up' },
  { metric: 'Deal Closure Rate', value: '28.4%', change: '+1.8%', trend: 'up' },
  { metric: 'Avg. Deal Size', value: '$2,156', change: '+12.7%', trend: 'up' },
];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [selectedTimeRange]);

  if (loading) {
    return <LoadingSystem variant="page" message="Cargando analytics..." size="lg" />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Analytics
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Análisis detallado del rendimiento de prospectación
          </p>
        </div>
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-gray-400" />
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {timeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Leads Totales"
          value="2,847"
          change="+12.5%"
          trend="up"
          icon={UsersIcon}
        />
        <StatCard
          title="Tasa de Conversión"
          value="28.4%"
          change="+3.1%"
          trend="up"
          icon={ArrowTrendingUpIcon}
        />
        <StatCard
          title="Revenue Generado"
          value="$24,680"
          change="+18.2%"
          trend="up"
          icon={CurrencyDollarIcon}
        />
        <StatCard
          title="Score Promedio"
          value="84"
          change="+8.2%"
          trend="up"
          icon={ChartBarIcon}
        />
      </div>

      {/* Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Métricas de Rendimiento
          </h3>
          <EyeIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={metric.metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {metric.metric}
                </span>
                <span className={`text-xs font-semibold ${
                  metric.trend === 'up' 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metric.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sources Performance */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Rendimiento por Fuente
          </h3>
          <FunnelIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {sourceData.map((source, index) => (
            <motion.div
              key={source.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${source.color}`} />
                <div>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {source.name}
                  </span>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {source.leads} leads
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-right">
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">
                    {source.conversion}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Conversión
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                    ${source.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Revenue
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Industry Distribution */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Distribución por Industria
          </h3>
          <ChartBarIcon className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {industryData.map((industry, index) => (
            <motion.div
              key={industry.name}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <span className="font-medium text-gray-900 dark:text-white min-w-0 flex-1">
                  {industry.name}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {industry.count}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${industry.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[3rem] text-right">
                  {industry.percentage}%
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 min-w-[3rem] text-right">
                  {industry.growth}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <SparklesIcon className="w-5 h-5 mr-2" />
            Exportar Reporte
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <ChartBarIcon className="w-5 h-5 mr-2" />
            Dashboard Personalizado
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <FunnelIcon className="w-5 h-5 mr-2" />
            Configurar Alertas
          </button>
        </div>
      </div>
    </div>
  );
} 