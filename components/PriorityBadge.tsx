
import React from 'react';
import { EmailPriority } from '../types';
import { PRIORITY_CONFIG } from '../constants';

interface PriorityBadgeProps {
  priority: EmailPriority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG[EmailPriority.None];

  return (
    <span
      className={`px-2 py-0.5 text-xs font-medium text-white rounded-full ${config.color}`}
    >
      {config.label}
    </span>
  );
};

export default PriorityBadge;
