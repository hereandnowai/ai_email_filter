
import React, { useState, useEffect, useContext, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EmailList from '../components/EmailList';
import EmailDetailView from '../components/EmailDetailView';
import StatsCard from '../components/StatsCard'; 
import { ICONS, EMAIL_CATEGORY_TABS, ACCENT_COLOR_DETAILS } from '../constants';
import { Email, EmailCategory, StatsData, EmailPriority, AppTheme } from '../types';
import { EmailContext, ThemeContext } from '../contexts';

const InboxPage: React.FC = () => {
  const emailContext = useContext(EmailContext);
  if (!emailContext) throw new Error("EmailContext not found");
  const { emails, selectedEmail, selectEmail, refreshEmails, originalEmails, searchQuery } = emailContext;

  const themeContext = useContext(ThemeContext);
  if(!themeContext) throw new Error("ThemeContext not found");
  const { theme, accentColor } = themeContext;
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];

  const navigate = useNavigate();
  const { category: categoryFromParams } = useParams<{ category?: EmailCategory }>();
  
  const [currentCategory, setCurrentCategory] = useState<EmailCategory>(categoryFromParams || EmailCategory.Inbox);
  const [isLoading, setIsLoading] = useState(false); // For initial load or refresh

  useEffect(() => {
    if (categoryFromParams) {
      setCurrentCategory(categoryFromParams);
    } else if (!categoryFromParams && currentCategory !== EmailCategory.Inbox) {
      // If no param but state is not inbox, reset to inbox and update URL
      setCurrentCategory(EmailCategory.Inbox);
      navigate(`/inbox/${EmailCategory.Inbox}`, { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryFromParams]);


  const handleRefresh = async () => {
    setIsLoading(true);
    selectEmail(null); // Deselect email on refresh
    // setSearchQuery(''); // Handled in App.tsx's refreshEmails now
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    refreshEmails(); // This will also clear search query as per App.tsx
    setIsLoading(false);
  };
  
  const filteredEmailsForCategory = useMemo(() => {
    // 'emails' from context is already filtered by search query and rules
    if (currentCategory === EmailCategory.Inbox) { 
        // For "Inbox" tab, show all emails that aren't explicitly archived or spam
        // The `emails` from context are already search-filtered and rule-filtered
        return emails.filter(e => e.category !== EmailCategory.Archived && e.category !== EmailCategory.Spam);
    }
    // For other category tabs, filter the (already search-filtered and rule-filtered) emails by that category
    return emails.filter(email => email.category === currentCategory);
  }, [emails, currentCategory]);

  const stats: StatsData = useMemo(() => {
    const today = new Date().toDateString();
    // Base stats on originalEmails to show overall picture, not affected by current search/filters
    return {
      totalEmails: originalEmails.length,
      filteredToday: originalEmails.filter(e => e.priority !== EmailPriority.None && new Date(e.timestamp).toDateString() === today).length, 
      priorityItems: originalEmails.filter(e => e.priority === EmailPriority.High && e.category !== EmailCategory.Archived && e.category !== EmailCategory.Spam).length,
      responseRate: 75, // Mocked
    };
  }, [originalEmails]);
  
  const noEmailsMessage = useMemo(() => {
    if (searchQuery.trim() !== '' && filteredEmailsForCategory.length === 0) {
      return {
        title: `No emails found for "${searchQuery}"`,
        text: currentCategory === EmailCategory.Inbox 
          ? "Try a different search term or clear the search."
          : `Try a different search term, clear the search, or check other categories.`,
      };
    }
    if (filteredEmailsForCategory.length === 0) {
      return {
        title: "No emails here",
        text: `This ${currentCategory.toLowerCase()} folder is currently empty.`,
      };
    }
    return null;
  }, [searchQuery, filteredEmailsForCategory, currentCategory]);

  const activeTabClass = theme === AppTheme.Dark 
    ? `bg-gray-800 ${accentDetails.darkText} shadow-sm`
    : `bg-white ${accentDetails.text} shadow-sm`;

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Emails" value={stats.totalEmails} icon={ICONS.inbox("w-6 h-6")} colorClass={`bg-${accentDetails.colorName}-500`} />
        <StatsCard title="Processed Today" value={stats.filteredToday} icon={ICONS.filters("w-6 h-6")} colorClass="bg-green-500" /> {/* Keep specific color */}
        <StatsCard title="Priority Items" value={stats.priorityItems} icon={ICONS.star("w-6 h-6")} colorClass="bg-yellow-500" /> {/* Keep specific color */}
        <StatsCard title="Response Rate" value={`${stats.responseRate}%`} icon={ICONS.analytics("w-6 h-6")} colorClass="bg-purple-500" /> {/* Keep specific color */}
      </div>

      {/* Email Section */}
      <div className="flex-1 flex flex-col md:flex-row md:space-x-4 min-h-0">
        {/* Email List and Tabs - always visible on larger screens, conditionally on mobile */}
        <div className={`flex-col md:w-1/3 lg:w-2/5 xl:w-1/3 ${selectedEmail && 'hidden md:flex'}`}>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex space-x-1 border border-gray-300 dark:border-gray-600 rounded-lg p-0.5 bg-gray-100 dark:bg-gray-700">
              {EMAIL_CATEGORY_TABS.map(tab => (
                <button
                  key={tab.name}
                  onClick={() => {
                    setCurrentCategory(tab.name);
                    navigate(`/inbox/${tab.name}`);
                    selectEmail(null); // Deselect email when changing category
                  }}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors
                    ${currentCategory === tab.name 
                      ? activeTabClass
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isLoading}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="Refresh emails"
            >
              {ICONS.refresh(isLoading ? "w-5 h-5 animate-spin" : "w-5 h-5")}
            </button>
          </div>
          <div className="flex-1 min-h-0"> {/* This div allows EmailList to scroll */}
            <EmailList 
                emails={filteredEmailsForCategory} 
                isLoading={isLoading} 
                customEmptyMessage={noEmailsMessage}
            />
          </div>
        </div>

        {/* Email Detail View - conditionally visible */}
        <div className={`flex-1 min-h-0 ${!selectedEmail && 'hidden md:block'}`}>
          <EmailDetailView />
        </div>
      </div>
    </div>
  );
};

export default InboxPage;
