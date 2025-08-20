import React from 'react';
import { UIModeType } from '../lib/types';

interface ModeBannerProps {
  mode: UIModeType;
  rationale?: string;
}

export default function ModeBanner({ mode, rationale }: ModeBannerProps) {
  const modeConfig = {
    Crisis: {
      bg: 'bg-danger-100 border-danger-300',
      text: 'text-danger-800',
      icon: '🚨',
      title: 'Crisis Support Mode',
      description: 'Immediate tools and support available'
    },
    Growth: {
      bg: 'bg-primary-100 border-primary-300', 
      text: 'text-primary-800',
      icon: '🌱',
      title: 'Growth & Learning Mode',
      description: 'Full toolkit for skill development'
    },
    Flow: {
      bg: 'bg-success-100 border-success-300',
      text: 'text-success-800', 
      icon: '✨',
      title: 'Flow & Maintenance Mode',
      description: 'Gentle support for continued progress'
    }
  };

  const config = modeConfig[mode];

  return (
    <div className={`${config.bg} border rounded-lg p-4 mb-6 animate-fade-in`}>
      <div className="flex items-start space-x-3">
        <span className="text-2xl">{config.icon}</span>
        <div className="flex-1">
          <h2 className={`${config.text} font-semibold text-lg mb-1`}>
            {config.title}
          </h2>
          <p className={`${config.text} text-sm opacity-90 mb-2`}>
            {config.description}
          </p>
          {rationale && (
            <div className={`${config.text} text-xs opacity-75 italic`}>
              {rationale}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}