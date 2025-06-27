
import React, { useContext } from 'react';
import { ThemeContext } from '../contexts';
import { ACCENT_COLOR_DETAILS } from '../constants';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error("ThemeContext not found");
  const { accentColor } = themeContext;
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];

  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <div
        className={`animate-spin rounded-full ${sizeClasses[size]} ${accentDetails.loaderBorder} border-t-transparent`}
      ></div>
      {text && <p className="text-sm text-gray-600 dark:text-gray-300">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
