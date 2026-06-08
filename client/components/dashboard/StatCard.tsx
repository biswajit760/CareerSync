'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  color: string;
  backgroundColor: string;
  borderColor: string;
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  onClick?: () => void;
  loading?: boolean;
}

const hoverCardProps = {
  whileHover: { y: -5, scale: 1.01 },
  // FIX: Added `as const` here
  transition: { type: 'spring' as const, stiffness: 300 },
};

/**
 * Reusable StatCard component for dashboard
 * Displays key metrics with icons and trends
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  color,
  backgroundColor,
  borderColor,
  trend,
  onClick,
  loading = false,
}) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.direction === 'up') {
      return <span className="text-lime-400">↑</span>;
    } else if (trend.direction === 'down') {
      return <span className="text-red-400">↓</span>;
    }
    return <span className="text-zinc-400">→</span>;
  };

  return (
    <motion.div
      {...hoverCardProps}
      onClick={onClick}
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-white/5
        bg-zinc-900/40
        backdrop-blur-xl
        p-6
        transition-colors
        duration-500
        ${borderColor}
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Gradient background effect */}
      <div className={`absolute -top-10 -right-10 w-32 h-32 ${backgroundColor} blur-[50px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

      <div className="relative z-10">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-4">
          <p className="text-zinc-400 text-sm font-semibold tracking-wider uppercase">
            {title}
          </p>
          <div className={`w-10 h-10 rounded-xl ${backgroundColor} border border-white/5 flex items-center justify-center`}>
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white" />
            ) : (
              <Icon size={20} className={color} />
            )}
          </div>
        </div>

        {/* Value */}
        <h3 className="text-5xl font-black text-white mb-2 tracking-tight">
          {loading ? '...' : value}
        </h3>

        {/* Description with trend */}
        <div className="flex items-center justify-between">
          <p className={`text-sm font-medium ${color}`}>
            {description}
          </p>
          {trend && getTrendIcon() && (
            <span className={`text-xs font-bold ml-2 ${
              trend.direction === 'up' ? 'text-lime-400' :
              trend.direction === 'down' ? 'text-red-400' :
              'text-zinc-400'
            }`}>
              {trend.percentage}%
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;