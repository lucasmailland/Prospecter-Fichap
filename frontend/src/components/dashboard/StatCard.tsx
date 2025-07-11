'use client';

import { ReactNode } from 'react';
import { designSystem, getMetricStyles } from '@/styles/design-system';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend?: 'up' | 'down' | 'neutral';
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: any; // Accept icon component
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  trend,
  changeType, 
  icon: IconComponent
}: StatCardProps) {
  // Convert trend to changeType if needed
  const finalChangeType = changeType || (trend === 'up' ? 'positive' : trend === 'down' ? 'negative' : 'neutral');
  
  return (
    <div className={`${designSystem.card.base} ${designSystem.card.hover} ${designSystem.spacing.card}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-1.5 rounded bg-gray-50 dark:bg-gray-700">
          <IconComponent className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </div>
        <div className={`text-[10px] font-bold ${getMetricStyles(finalChangeType)}`}>
          {change}
        </div>
      </div>
      <div>
        <h3 className={`${designSystem.typography.metric} mb-0.5`}>{value}</h3>
        <p className={designSystem.typography.body}>{title}</p>
      </div>
    </div>
  );
} 