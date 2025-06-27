
import React, { useContext, useState } from 'react';
import { ICONS, DEFAULT_USER_PROFILE, ACCENT_COLOR_DETAILS, FONT_SIZE_DETAILS } from '../constants';
import ToggleSwitch from '../components/ToggleSwitch';
import LoadingSpinner from '../components/LoadingSpinner'; // Import LoadingSpinner
import { ThemeContext } from '../contexts';
import { AppTheme, AccentColorName, FontSizeName } from '../types';


const SettingsPage: React.FC = () => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error("ThemeContext not found");
  const { theme, toggleTheme, accentColor, changeAccentColor, fontSize, changeFontSize } = themeContext;

  const currentAccentDetails = ACCENT_COLOR_DETAILS[accentColor];

  // State for simulated connection
  type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'failed';
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('idle');
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleConnectGmail = () => {
    setConnectionStatus('connecting');
    setConnectionError(null);
    console.log("Simulating Gmail connection attempt...");

    setTimeout(() => {
      // Simulate success or failure
      if (Math.random() > 0.3) { // ~70% chance of success for demo
        setConnectionStatus('connected');
        setConnectedEmail('demo.user@gmail.com'); // Mock email
        console.log("Simulated Gmail connection successful.");
      } else {
        setConnectionStatus('failed');
        setConnectionError('Simulated connection error. Please try again or check your (mock) settings.');
        console.error("Simulated Gmail connection failed.");
      }
    }, 2500); // Simulate network delay
  };

  const handleDisconnectGmail = () => {
    setConnectionStatus('idle');
    setConnectedEmail(null);
    setConnectionError(null);
    console.log("Simulated Gmail disconnection.");
  };

  const connectButtonBg = theme === AppTheme.Dark ? (currentAccentDetails.darkButtonBg || currentAccentDetails.buttonBg) : currentAccentDetails.buttonBg;
  const connectButtonHoverBg = theme === AppTheme.Dark ? (currentAccentDetails.darkButtonHoverBg || currentAccentDetails.buttonHoverBg) : currentAccentDetails.buttonHoverBg;
  const connectButtonFocusRing = theme === AppTheme.Dark ? currentAccentDetails.darkFocusRing + ' dark:focus:ring-offset-gray-800' : currentAccentDetails.focusRing + ' focus:ring-offset-white';


  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Settings</h1>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Profile</h2>
        <div className="flex items-center space-x-4">
          <img src={DEFAULT_USER_PROFILE.avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full" />
          <div>
            <p className="text-lg font-medium text-gray-800 dark:text-gray-100">{DEFAULT_USER_PROFILE.name}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{DEFAULT_USER_PROFILE.email}</p>
          </div>
          <button className={`ml-auto px-3 py-1.5 text-sm border rounded-md hover:bg-opacity-10
            ${theme === AppTheme.Dark ? currentAccentDetails.darkText + ' border-' + currentAccentDetails.colorName + '-400 hover:bg-' + currentAccentDetails.colorName + '-400' 
                                     : currentAccentDetails.text + ' border-' + currentAccentDetails.colorName + '-500 hover:bg-' + currentAccentDetails.colorName + '-500' }`}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* Connected Accounts Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Connected Accounts</h2>
        <div className="space-y-4">
          {connectionStatus === 'idle' && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                No email accounts are currently connected. Connect your Gmail account to start managing your emails with HERE AND NOW AI.
              </p>
              <button
                onClick={handleConnectGmail}
                className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm
                            ${connectButtonBg} ${connectButtonHoverBg}
                            focus:outline-none focus:ring-2 focus:ring-offset-2 ${connectButtonFocusRing}`}
              >
                {ICONS.plus("w-5 h-5")} 
                <span>Connect Gmail Account</span>
              </button>
            </>
          )}

          {connectionStatus === 'connecting' && (
            <div className="flex flex-col items-center justify-center space-y-3 p-4">
              <LoadingSpinner size="md" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Attempting to connect to Gmail...</p>
            </div>
          )}

          {connectionStatus === 'failed' && (
            <>
              <p className="text-sm text-red-600 dark:text-red-400">{connectionError}</p>
              <button
                onClick={handleConnectGmail}
                className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm
                            ${connectButtonBg} ${connectButtonHoverBg}
                            focus:outline-none focus:ring-2 focus:ring-offset-2 ${connectButtonFocusRing}`}
              >
                {ICONS.refresh("w-5 h-5")} 
                <span>Try Connecting Gmail Again</span>
              </button>
            </>
          )}

          {connectionStatus === 'connected' && connectedEmail && (
            <div className="p-3 bg-green-50 dark:bg-green-700/30 border border-green-300 dark:border-green-600 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-100">{connectedEmail}</p>
                  <p className="text-xs text-green-600 dark:text-green-300 flex items-center">
                    {ICONS.checkCircle("w-4 h-4 mr-1")}
                    Connected
                  </p>
                </div>
                <button 
                    onClick={handleDisconnectGmail}
                    className="text-sm text-red-500 hover:underline"
                >
                    Disconnect
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Appearance Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Appearance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Dark Mode</span>
            <ToggleSwitch 
                checked={theme === AppTheme.Dark} 
                onChange={toggleTheme}
                id="darkModeToggle"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Accent Color</span>
            <div className="flex space-x-2">
              {(Object.keys(ACCENT_COLOR_DETAILS) as AccentColorName[]).map((colorKey) => {
                const details = ACCENT_COLOR_DETAILS[colorKey];
                return (
                  <button
                    key={colorKey}
                    title={details.name}
                    onClick={() => changeAccentColor(colorKey)}
                    className={`w-6 h-6 rounded-full bg-${details.colorName}-${theme === AppTheme.Dark ? '400' : '600'} 
                                ${accentColor === colorKey ? `ring-2 ring-offset-2 dark:ring-offset-gray-800 ${theme === AppTheme.Dark ? details.darkRing : details.ring}` : ''}
                                hover:ring-2 ring-offset-2 dark:ring-offset-gray-800 ${theme === AppTheme.Dark ? details.darkRing : details.ring}`}
                  />
                );
              })}
            </div>
          </div>
           <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-300">Font Size</span>
             <select 
                value={fontSize}
                onChange={(e) => changeFontSize(e.target.value as FontSizeName)}
                className={`p-1 border text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:outline-none focus:ring-1 
                ${theme === AppTheme.Dark ? currentAccentDetails.darkFocusRing : currentAccentDetails.focusRing} border-gray-300 dark:border-gray-600`}
             >
                {(Object.keys(FONT_SIZE_DETAILS) as FontSizeName[]).map(key => (
                  <option key={key} value={key}>{FONT_SIZE_DETAILS[key].name}</option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">Notifications</h2>
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">New Email Notifications</span>
                <ToggleSwitch checked={true} onChange={() => {}} id="newEmailNotif"/>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">AI Summary Ready</span>
                <ToggleSwitch checked={true} onChange={() => {}} id="aiSummaryNotif"/>
            </div>
            <div className="flex items-center justify-between">
                <span className="text-gray-600 dark:text-gray-300">Filter Activity Reports</span>
                <ToggleSwitch checked={false} onChange={() => {}} id="filterActivityNotif"/>
            </div>
        </div>
      </div>
      
      {/* API Key Info - Read only as per instructions */}
       <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">API Configuration</h2>
        <div className="flex items-center space-x-2">
            {ICONS.informationCircle(`w-5 h-5 ${theme === AppTheme.Dark ? currentAccentDetails.darkText : currentAccentDetails.text}`)}
            <p className="text-sm text-gray-600 dark:text-gray-300">
            The Gemini API key is configured via an environment variable (<code>process.env.API_KEY</code>) and is not manageable through this interface.
            </p>
        </div>
        {(!process.env.API_KEY || process.env.API_KEY === "YOUR_GEMINI_API_KEY") && (
            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-700/30 border border-yellow-300 dark:border-yellow-600 rounded-md text-yellow-700 dark:text-yellow-200 text-sm">
                {ICONS.xCircle("w-5 h-5 inline mr-1")}
                Warning: Gemini API key is not properly configured. AI features may not work.
            </div>
        )}
         {(process.env.API_KEY && process.env.API_KEY !== "YOUR_GEMINI_API_KEY") && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-700/30 border border-green-300 dark:border-green-600 rounded-md text-green-700 dark:text-green-200 text-sm">
                {ICONS.checkCircle("w-5 h-5 inline mr-1")}
                Gemini API key is configured.
            </div>
        )}
      </div>

    </div>
  );
};

export default SettingsPage;