
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import InboxPage from './pages/InboxPage';
import FiltersPage from './pages/FiltersPage';
import AnalyticsPage from './pages/AnalyticsPage'; // Corrected/Ensured relative path
import SettingsPage from './pages/SettingsPage';
import { Email, FilterRule, AppTheme, AccentColorName, FontSizeName } from './types';
import { getMockEmails, applyFilters } from './services/mockEmailService';
import { EmailContext, FilterContext, ThemeContext } from './contexts';
import { ACCENT_COLOR_DETAILS, FONT_SIZE_DETAILS } from './constants';

const App: React.FC = () => {
  const [emails, setEmails] = useState<Email[]>(getMockEmails(50));
  const [filteredEmails, setFilteredEmails] = useState<Email[]>(emails);
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [theme, setTheme] = useState<AppTheme>(() => {
    const storedTheme = localStorage.getItem('app-theme') as AppTheme | null;
    if (storedTheme) {
      return storedTheme;
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return AppTheme.Dark;
    }
    return AppTheme.Light;
  });

  const [accentColor, setAccentColor] = useState<AccentColorName>(() => {
    const storedAccent = localStorage.getItem('app-accent-color') as AccentColorName | null;
    return storedAccent && ACCENT_COLOR_DETAILS[storedAccent] ? storedAccent : 'blue';
  });

  const [fontSize, setFontSize] = useState<FontSizeName>(() => {
    const storedSize = localStorage.getItem('app-font-size') as FontSizeName | null;
    return storedSize && FONT_SIZE_DETAILS[storedSize] ? storedSize : 'normal';
  });

  useEffect(() => {
    if (theme === AppTheme.Dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === AppTheme.Light ? AppTheme.Dark : AppTheme.Light));
  }, []);

  const changeAccentColor = useCallback((color: AccentColorName) => {
    if (ACCENT_COLOR_DETAILS[color]) {
      setAccentColor(color);
      localStorage.setItem('app-accent-color', color);
    }
  }, []);

  useEffect(() => {
    const sizeDetails = FONT_SIZE_DETAILS[fontSize];
    document.documentElement.style.fontSize = sizeDetails.rootSize;
    localStorage.setItem('app-font-size', fontSize);
  }, [fontSize]);

  const changeFontSize = useCallback((size: FontSizeName) => {
    if (FONT_SIZE_DETAILS[size]) {
      setFontSize(size);
    }
  }, []);

  const refreshEmails = useCallback(() => {
    const newEmails = getMockEmails(50); // Fetch new set of mock emails
    setEmails(newEmails);
    setSearchQuery(''); // Optionally clear search on refresh
  }, []);

  useEffect(() => {
    let emailsToProcess = [...emails]; // Start with a copy of original emails

    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      emailsToProcess = emailsToProcess.filter(email =>
        email.sender.toLowerCase().includes(lowercasedQuery) ||
        email.subject.toLowerCase().includes(lowercasedQuery) ||
        email.body.toLowerCase().includes(lowercasedQuery)
      );
    }

    const processedEmails = applyFilters(emailsToProcess, filters);
    setFilteredEmails(processedEmails);
  }, [emails, filters, searchQuery]);

  const handleSelectEmail = useCallback((email: Email | null) => {
    setSelectedEmail(email);
    if (email) {
       // Mark as read (locally)
      setEmails(prevEmails => prevEmails.map(e => e.id === email.id ? {...e, read: true} : e));
    }
  }, []);

  const updateEmail = useCallback((updatedEmail: Email) => {
    setEmails(prevEmails => prevEmails.map(e => e.id === updatedEmail.id ? updatedEmail : e));
    if (selectedEmail && selectedEmail.id === updatedEmail.id) {
      setSelectedEmail(updatedEmail);
    }
  }, [selectedEmail]);
  
  const addFilter = useCallback((filter: FilterRule) => {
    setFilters(prev => [...prev, { ...filter, id: Date.now().toString() }]);
  }, []);

  const updateFilter = useCallback((updatedFilter: FilterRule) => {
    setFilters(prev => prev.map(f => f.id === updatedFilter.id ? updatedFilter : f));
  }, []);

  const deleteFilter = useCallback((filterId: string) => {
    setFilters(prev => prev.filter(f => f.id !== filterId));
  }, []);


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, changeAccentColor, fontSize, changeFontSize }}>
      <EmailContext.Provider value={{ 
        emails: filteredEmails, 
        selectedEmail, 
        selectEmail: handleSelectEmail, 
        updateEmail, 
        refreshEmails, 
        originalEmails: emails,
        searchQuery,
        setSearchQuery
      }}>
        <FilterContext.Provider value={{ filters, addFilter, updateFilter, deleteFilter }}>
          <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Sidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
            <div className="flex-1 flex flex-col overflow-hidden">
              <TopNav setIsMobileMenuOpen={setIsMobileMenuOpen} />
              <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-6">
                <Routes>
                  <Route path="/" element={<Navigate to="/inbox" replace />} />
                  <Route path="/inbox" element={<InboxPage />} />
                  <Route path="/inbox/:category" element={<InboxPage />} />
                  <Route path="/filters" element={<FiltersPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </main>
            </div>
          </div>
        </FilterContext.Provider>
      </EmailContext.Provider>
    </ThemeContext.Provider>
  );
};

export default App;
