
import React, { useContext } from 'react';
import { ThemeContext } from '../contexts';
import { ACCENT_COLOR_DETAILS } from '../constants';
import { AppTheme } from '../types';

interface ToggleSwitchProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange, label, disabled }) => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error("ThemeContext not found");
  const { theme, accentColor } = themeContext;
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];

  const toggle = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };
  
  const checkedBgClass = checked 
    ? (theme === AppTheme.Dark ? accentDetails.darkToggleCheckedBg : accentDetails.toggleCheckedBg) 
    : 'bg-gray-300 dark:bg-gray-600';

  return (
    <label htmlFor={id} className={`flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      {label && <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">{label}</span>}
      <div className="relative">
        <input 
          id={id} 
          type="checkbox" 
          className="sr-only" 
          checked={checked} 
          onChange={toggle} 
          disabled={disabled} 
        />
        <div className={`block w-10 h-6 rounded-full transition-colors ${checkedBgClass}`}
        ></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform
          ${checked ? 'translate-x-full' : ''}`}
        ></div>
      </div>
    </label>
  );
};

export default ToggleSwitch;