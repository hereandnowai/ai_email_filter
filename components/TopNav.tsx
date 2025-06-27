
import React, { useState, useContext, useRef, useEffect } from 'react';
import { ICONS, DEFAULT_USER_PROFILE, ACCENT_COLOR_DETAILS } from '../constants';
import { ThemeContext, EmailContext } from '../contexts';
import { AppTheme } from '../types';

interface TopNavProps {
  setIsMobileMenuOpen: (isOpen: boolean) => void;
}

const TopNav: React.FC<TopNavProps> = ({ setIsMobileMenuOpen }) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error("ThemeContext not found");
  const { theme, toggleTheme, accentColor } = themeContext;
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];

  const emailContext = useContext(EmailContext);
  if (!emailContext) throw new Error("EmailContext not found");
  const { searchQuery, setSearchQuery } = emailContext;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const focusRingClass = theme === AppTheme.Dark ? accentDetails.darkFocusRing : accentDetails.focusRing;
  const avatarBorderClass = theme === AppTheme.Dark ? `border-${accentDetails.colorName}-400` : `border-${accentDetails.colorName}-500`;

  const hamburgerHoverClass = theme === AppTheme.Dark
  ? `dark:hover:${accentDetails.darkText.substring(accentDetails.darkText.indexOf(':') + 1)}` // e.g. dark:hover:text-blue-400
  : `hover:${accentDetails.text}`; // e.g. hover:text-blue-600

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex items-center justify-between print:hidden">
      {/* Hamburger Menu for Mobile */}
      <button 
        onClick={() => setIsMobileMenuOpen(true)}
        className={`lg:hidden text-gray-600 dark:text-gray-300 ${hamburgerHoverClass} p-2 rounded-md`}
      >
        {ICONS.menu()}
      </button>

      {/* Search Bar */}
      <div className="relative hidden sm:block">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          {ICONS.search("text-gray-400 dark:text-gray-500")}
        </span>
        <input
          type="search"
          placeholder="Search emails..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full md:w-96 pl-10 ${searchQuery ? 'pr-10' : 'pr-4'} py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 ${focusRingClass} bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200`}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            {ICONS.close('w-4 h-4')}
          </button>
        )}
      </div>
      
      {/* Spacer for small screens when search is hidden */}
      <div className="sm:hidden flex-1"></div>


      {/* Right side icons */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={toggleTheme} 
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          aria-label={theme === AppTheme.Light ? "Switch to dark mode" : "Switch to light mode"}
        >
          {theme === AppTheme.Light ? ICONS.moon() : ICONS.sun()}
        </button>
        
        {/* Notifications */}
        <div ref={notificationRef} className="relative">
          <button 
            onClick={() => setNotificationsOpen(!notificationsOpen)} 
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 relative"
          >
            {ICONS.notification()}
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-800"></span>
          </button>
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-20 border dark:border-gray-700">
              <div className="p-4 font-semibold border-b dark:border-gray-700 text-gray-700 dark:text-gray-200">Notifications</div>
              <ul className="max-h-80 overflow-y-auto">
                {/* Placeholder notifications */}
                <li className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-600 dark:text-gray-300">New AI summary available for "Project Phoenix"</li>
                <li className="p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-600 dark:text-gray-300">Filter "Urgent" processed 5 emails</li>
                <li className={`p-4 text-center text-sm ${theme === AppTheme.Dark ? accentDetails.darkText : accentDetails.text} hover:underline`}>View all</li>
              </ul>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div ref={profileRef} className="relative">
          <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <img
              src={DEFAULT_USER_PROFILE.avatarUrl}
              alt="User Avatar"
              className={`w-8 h-8 rounded-full border-2 ${avatarBorderClass}`}
            />
            <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200">{DEFAULT_USER_PROFILE.name}</span>
            {ICONS.chevronDown("hidden md:inline w-4 h-4 text-gray-500 dark:text-gray-400")}
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-20 border dark:border-gray-700">
              <a href="#/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Profile</a>
              <a href="#/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Settings</a>
              <hr className="dark:border-gray-700"/>
              <a href="#" className="block px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-700/30">Logout</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopNav;
