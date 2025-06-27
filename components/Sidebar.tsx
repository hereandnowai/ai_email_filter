
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { ICONS, ACCENT_COLOR_DETAILS } from '../constants';
import { EmailCategory, AppTheme } from '../types';
import { ThemeContext } from '../contexts';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: 'Inbox', path: `/inbox/${EmailCategory.Inbox}`, icon: ICONS.inbox("w-6 h-6") },
  { name: 'Filters', path: '/filters', icon: ICONS.filters("w-6 h-6") },
  { name: 'Analytics', path: '/analytics', icon: ICONS.analytics("w-6 h-6") },
  { name: 'Settings', path: '/settings', icon: ICONS.settings("w-6 h-6") },
];

const Sidebar: React.FC<SidebarProps> = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error("ThemeContext not found");
  const { theme, accentColor } = themeContext;
  
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];

  const sidebarBgColor = theme === AppTheme.Light ? accentDetails.sidebarBg : 'dark:bg-gray-800';
  
  // For NavLinks
  const navLinkHoverBg = theme === AppTheme.Light ? `hover:${accentDetails.sidebarActiveBg}` : 'dark:hover:bg-gray-700';
  const navLinkActiveBg = theme === AppTheme.Light ? accentDetails.sidebarActiveBg : 'dark:bg-gray-700';

  // For the close button on mobile
  const closeButtonHoverClass = theme === AppTheme.Light 
    ? `hover:${accentDetails.sidebarActiveBg} hover:bg-opacity-75` // e.g. hover:bg-blue-700 hover:bg-opacity-75
    : `dark:hover:bg-gray-600`; // Sidebar dark is gray-800, active link is gray-700, so hover for button can be gray-600

  const baseClasses = "flex flex-col h-full p-4 space-y-4 text-white dark:text-gray-200 transition-all duration-300 ease-in-out";
  const logoUrl = "https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png";

  return (
    <>
      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 ${sidebarBgColor} ${baseClasses} ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}>
        <div className="flex items-center justify-between">
          {/* Company Logo */}
          <img 
            src={logoUrl} 
            alt="HERE AND NOW AI Logo" 
            className="h-14 w-auto object-contain" // Increased height from h-10 to h-14
          />
          <button 
            onClick={() => setIsMobileMenuOpen(false)} 
            className={`lg:hidden text-white p-1 rounded-md ${closeButtonHoverClass}`}
          >
            {ICONS.close("w-6 h-6")}
          </button>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center space-x-3 p-3 rounded-lg ${navLinkHoverBg} transition-colors duration-200 ${
                  isActive ? `${navLinkActiveBg} font-semibold shadow-inner` : ''
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className={`mt-auto p-2 text-center text-xs ${theme === AppTheme.Light ? 'text-gray-200' : 'text-gray-400'}`}>
          <p>&copy; {new Date().getFullYear()} HERE AND NOW AI</p>
          <p>Artificial Intelligence Research Institute</p>
          <p className="mt-1">Developed by Adhithya J</p>
          <p>[ AI Products Engineering Team ]</p>
          <p className="mt-2">Version 1.0.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
