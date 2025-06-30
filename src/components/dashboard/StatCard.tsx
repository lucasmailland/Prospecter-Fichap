'use client';

import { ReactNode } from 'react';
import { designSystem, getMetricStyles } from '@/styles/design-system';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: ReactNode;
  color?: string; // Mantener para compatibilidad pero ignorar
}

export default function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon
}: StatCardProps) {
  return (
    <div className={`${designSystem.card.base} ${designSystem.card.hover} ${designSystem.spacing.card}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="p-1.5 rounded bg-gray-50 dark:bg-gray-700">
          <div className="text-gray-500 dark:text-gray-400">
            {icon}
          </div>
        </div>
        <div className={`text-[10px] font-bold ${getMetricStyles(changeType)}`}>
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