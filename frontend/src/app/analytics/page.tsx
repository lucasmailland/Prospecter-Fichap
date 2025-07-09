'use client';

import { useState, useEffect } from 'react';

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

// Componente StatCard simplificado
function StatCard({ title, value, change, trend, iconName }: unknown) {
  return (
    <div className="bg-white rounded-lg shadow border p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="p-1.5 rounded bg-gray-50">
          <div className="w-5 h-5 text-gray-500 flex items-center justify-center">
            {iconName}
          </div>
        </div>
        <div className={`text-xs font-bold ${
          trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
        }`}>
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-0.5">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [selectedTimeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
              Analytics
            </h1>
            <p className="mt-2 text-gray-600">
              Análisis detallado del rendimiento de prospectación
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400">📅</span>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            iconName="👥"
          />
          <StatCard
            title="Tasa de Conversión"
            value="28.4%"
            change="+3.1%"
            trend="up"
            iconName="📈"
          />
          <StatCard
            title="Revenue Generado"
            value="$24,680"
            change="+18.2%"
            trend="up"
            iconName="💰"
          />
          <StatCard
            title="Score Promedio"
            value="84"
            change="+8.2%"
            trend="up"
            iconName="📊"
          />
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl p-6 shadow border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Métricas de Rendimiento
            </h3>
            <span className="text-gray-400">👁️</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceMetrics.map((metric, _index) => (
              <div
                key={metric.metric}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    {metric.metric}
                  </span>
                  <span className={`text-xs font-semibold ${
                    metric.trend === 'up' 
                      ? 'text-emerald-600' 
                      : 'text-red-600'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {metric.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sources Performance */}
        <div className="bg-white rounded-xl p-6 shadow border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Rendimiento por Fuente
            </h3>
            <span className="text-gray-400">🔽</span>
          </div>
          <div className="space-y-4">
            {sourceData.map((source, _index) => (
              <div
                key={source.name}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${source.color}`} />
                  <div>
                    <span className="font-semibold text-gray-900">
                      {source.name}
                    </span>
                    <div className="text-sm text-gray-600">
                      {source.leads} leads
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-right">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {source.conversion}%
                    </div>
                    <div className="text-xs text-gray-500">
                      Conversión
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-emerald-600">
                      ${source.revenue.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      Revenue
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Industry Distribution */}
        <div className="bg-white rounded-xl p-6 shadow border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Distribución por Industria
            </h3>
            <span className="text-gray-400">📊</span>
          </div>
          <div className="space-y-4">
            {industryData.map((industry, _index) => (
              <div
                key={industry.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900 min-w-0 flex-1">
                    {industry.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    {industry.count}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${industry.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 min-w-[3rem] text-right">
                    {industry.percentage}%
                  </span>
                  <span className="text-xs font-semibold text-emerald-600 min-w-[3rem] text-right">
                    {industry.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="mr-2">✨</span>
              Exportar Reporte
            </button>
            <button className="flex items-center justify-center p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <span className="mr-2">📊</span>
              Dashboard Personalizado
            </button>
            <button className="flex items-center justify-center p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <span className="mr-2">🔔</span>
              Configurar Alertas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 