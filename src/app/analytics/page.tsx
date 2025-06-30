'use client';

import Layout from '@/components/layout/Layout';
import { designSystem } from '@/styles/design-system';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import StatCard from '@/components/dashboard/StatCard';

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  const stats = [
    {
      title: 'Total de Leads',
      value: '12,847',
      change: '+18.2%',
      changeType: 'positive' as const,
      icon: <UserGroupIcon className="h-4 w-4" />,
    },
    {
      title: 'Score Promedio',
      value: '84.3',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <ChartBarIcon className="h-4 w-4" />,
    },
    {
      title: 'Tasa de Conversión',
      value: '28.4%',
      change: '+3.2%',
      changeType: 'positive' as const,
      icon: <ArrowTrendingUpIcon className="h-4 w-4" />,
    },
    {
      title: 'Revenue Total',
      value: '$2,156,789',
      change: '+24.1%',
      changeType: 'positive' as const,
      icon: <CurrencyDollarIcon className="h-4 w-4" />,
    },
  ];

  const performanceBySource = [
    {
      source: 'LinkedIn',
      leads: 4234,
      conversion: 32.1,
      revenue: 890450,
      trend: 'up',
    },
    {
      source: 'Cold Email',
      leads: 3421,
      conversion: 28.7,
      revenue: 720330,
      trend: 'up',
    },
    {
      source: 'Website Forms',
      leads: 2987,
      conversion: 35.2,
      revenue: 654890,
      trend: 'up',
    },
    {
      source: 'Referrals',
      leads: 1789,
      conversion: 41.8,
      revenue: 432100,
      trend: 'up',
    },
    {
      source: 'Paid Ads',
      leads: 1456,
      conversion: 22.3,
      revenue: 298540,
      trend: 'down',
    },
  ];

  const industryBreakdown = [
    {
      industry: 'Technology',
      leads: 3456,
      percentage: 27.8,
      averageScore: 89.2,
      trend: 'excellent',
    },
    {
      industry: 'Finance',
      leads: 2987,
      percentage: 24.1,
      averageScore: 82.4,
      trend: 'good',
    },
    {
      industry: 'Healthcare',
      leads: 2134,
      percentage: 17.2,
      averageScore: 78.9,
      trend: 'good',
    },
    {
      industry: 'Education',
      leads: 1789,
      percentage: 14.4,
      averageScore: 71.3,
      trend: 'fair',
    },
    {
      industry: 'Retail',
      leads: 1234,
      percentage: 9.9,
      averageScore: 65.7,
      trend: 'fair',
    },
    {
      industry: 'Manufacturing',
      leads: 789,
      percentage: 6.3,
      averageScore: 58.2,
      trend: 'poor',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 80) return designSystem.score.excellent;
    if (score >= 60) return designSystem.score.good;
    if (score >= 40) return designSystem.score.fair;
    return designSystem.score.poor;
  };

  const getTrendColor = (trend: string) => {
    const trendMap = {
      'excellent': designSystem.progressBar.excellent,
      'good': designSystem.progressBar.good,
      'fair': designSystem.progressBar.fair,
      'poor': designSystem.progressBar.poor,
      'up': designSystem.progressBar.success,
      'down': designSystem.progressBar.danger,
    };
    return trendMap[trend as keyof typeof trendMap] || designSystem.progressBar.neutral;
  };

  const getMetricColor = (change: number) => {
    if (change > 0) return designSystem.metrics.positive;
    if (change < 0) return designSystem.metrics.negative;
    return designSystem.metrics.neutral;
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
              <h1 className={designSystem.typography.h1}>Analytics</h1>
              <p className={`${designSystem.typography.body} mt-1`}>
                Insights profundos sobre tu proceso de prospección
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex bg-gray-100 dark:bg-gray-800 p-0.5 rounded-md">
                {['7d', '30d', '90d', '1a'].map((period) => (
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
              <button
                onClick={() => window.location.reload()}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <ArrowPathIcon className="h-3 w-3" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* KPI Cards */}
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

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Performance by Source */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`${designSystem.card.base}`}
          >
            <div className={`${designSystem.spacing.cardHeader} border-b border-gray-100 dark:border-gray-700`}>
              <h3 className={designSystem.typography.h2}>Rendimiento por Fuente</h3>
              <p className={`${designSystem.typography.body} mt-0.5`}>Leads y conversión por canal</p>
            </div>
            <div className={designSystem.spacing.cardContent}>
              <div className="space-y-0">
                {performanceBySource.map((item, index) => (
                  <motion.div
                    key={item.source}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-b-0 ${designSystem.card.interactive} -mx-5 px-5`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getTrendColor(item.trend)}`}></div>
                      <div>
                        <div className={designSystem.typography.h3}>{item.source}</div>
                        <div className={`${designSystem.typography.caption} text-[10px]`}>
                          {item.leads.toLocaleString()} leads
                        </div>
                      </div>
                    </div>
                    <div className="text-right space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <span className={`${designSystem.typography.h3} ${getMetricColor(item.conversion)}`}>
                          {item.conversion}%
                        </span>
                        <span className={`${designSystem.typography.caption} ${getMetricColor(item.revenue)}`}>
                          ${item.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full ${getTrendColor(item.trend)}`}
                          style={{ width: `${Math.min(item.conversion * 2, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Top Industries */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`${designSystem.card.base}`}
          >
            <div className={`${designSystem.spacing.cardHeader} border-b border-gray-100 dark:border-gray-700`}>
              <h3 className={designSystem.typography.h2}>Top Industrias</h3>
              <p className={`${designSystem.typography.body} mt-0.5`}>Distribución por sector</p>
            </div>
            <div className={designSystem.spacing.cardContent}>
              <div className="space-y-0">
                {industryBreakdown.map((item, index) => (
                  <motion.div
                    key={item.industry}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center justify-between py-2.5 border-b border-gray-50 dark:border-gray-700 last:border-b-0 ${designSystem.card.interactive} -mx-5 px-5`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getTrendColor(item.trend)}`}></div>
                      <div>
                        <div className={designSystem.typography.h3}>{item.industry}</div>
                        <div className={`${designSystem.typography.caption} text-[10px]`}>
                          {item.leads.toLocaleString()} leads • {item.percentage}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${getScoreColor(item.averageScore)}`}>
                        {item.averageScore}
                      </div>
                      <div className={`${designSystem.typography.caption} text-[9px]`}>Score</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
} 