
import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Email, Sentiment, EmailPriority, AppTheme } from '../types';
import { getEmailSentiment, summarizeEmail } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import SentimentDisplay from './SentimentDisplay';
import PriorityBadge from './PriorityBadge';
import SmartReplySection from './SmartReplySection';
import { ICONS, ACCENT_COLOR_DETAILS } from '../constants';
import { EmailContext, ThemeContext } from '../contexts';

const EmailDetailView: React.FC = () => {
  const emailContext = useContext(EmailContext);
  if (!emailContext) throw new Error("EmailContext not found");
  const { selectedEmail, updateEmail, selectEmail } = emailContext;

  const themeContext = useContext(ThemeContext);
  if(!themeContext) throw new Error("ThemeContext not found");
  const { theme, accentColor } = themeContext;
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];
  
  const [currentSentiment, setCurrentSentiment] = useState<Sentiment | undefined>(selectedEmail?.sentiment);
  const [sentimentLoading, setSentimentLoading] = useState(false);
  const [summary, setSummary] = useState<string | undefined>(selectedEmail?.summary);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSentiment = useCallback(async (emailContent: string, emailId: string) => {
    setSentimentLoading(true);
    setError(null);
    try {
      const sentiment = await getEmailSentiment(emailContent);
      setCurrentSentiment(sentiment);
      // Update the email in the global state
      if (selectedEmail && selectedEmail.id === emailId) {
        updateEmail({ ...selectedEmail, sentiment });
      }
    } catch (err) {
      console.error("Failed to fetch sentiment:", err);
      setError("Could not analyze sentiment. API key might be missing or invalid.");
      setCurrentSentiment(Sentiment.Unknown);
    } finally {
      setSentimentLoading(false);
    }
  }, [selectedEmail, updateEmail]);

  const fetchSummary = useCallback(async (emailContent: string, emailId: string) => {
    setSummaryLoading(true);
    setError(null);
    try {
      const result = await summarizeEmail(emailContent);
      setSummary(result);
       if (selectedEmail && selectedEmail.id === emailId) {
        updateEmail({ ...selectedEmail, summary: result });
      }
    } catch (err) {
      console.error("Failed to fetch summary:", err);
      setError("Could not generate summary. API key might be missing or invalid.");
    } finally {
      setSummaryLoading(false);
    }
  }, [selectedEmail, updateEmail]);


  useEffect(() => {
    if (selectedEmail) {
      setCurrentSentiment(selectedEmail.sentiment);
      setSummary(selectedEmail.summary);

      if (selectedEmail.body && !selectedEmail.sentiment) {
        fetchSentiment(selectedEmail.body, selectedEmail.id);
      }
      if (selectedEmail.body && !selectedEmail.summary) {
         fetchSummary(selectedEmail.body, selectedEmail.id);
      }
    } else {
      setCurrentSentiment(undefined);
      setSummary(undefined);
      setError(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmail?.id]); // Re-run if selectedEmail ID changes

  if (!selectedEmail) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
              className={`w-20 h-20 mb-6 ${theme === AppTheme.Dark ? 'text-' + accentDetails.colorName + '-700' : 'text-' + accentDetails.colorName + '-300'}`}
          >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
        </svg>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Select an email to view</h2>
        <p className="text-gray-500 dark:text-gray-400">Choose an email from the list to see its details and AI insights.</p>
      </div>
    );
  }
  
  const handlePriorityChange = (priority: EmailPriority) => {
     updateEmail({ ...selectedEmail, priority });
  };

  const aiSummaryBg = theme === AppTheme.Dark ? `dark:bg-${accentDetails.colorName}-900/30` : `bg-${accentDetails.colorName}-50`;
  const aiSummaryTextColor = theme === AppTheme.Dark ? `dark:text-${accentDetails.colorName}-300` : `text-${accentDetails.colorName}-700`;
  const backButtonColor = theme === AppTheme.Dark ? accentDetails.darkText : accentDetails.text;
  const replyButtonBg = theme === AppTheme.Dark ? accentDetails.darkButtonBg || accentDetails.buttonBg : accentDetails.buttonBg;
  const replyButtonHoverBg = theme === AppTheme.Dark ? accentDetails.darkButtonHoverBg || accentDetails.buttonHoverBg : accentDetails.buttonHoverBg;
  const focusRingClass = theme === AppTheme.Dark ? accentDetails.darkFocusRing : accentDetails.focusRing;

  return (
    <div className="bg-white dark:bg-gray-800 h-full flex flex-col rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
         <button 
            onClick={() => selectEmail(null)} 
            className={`lg:hidden mb-2 flex items-center text-sm ${backButtonColor} hover:underline`}
          >
            {ICONS.chevronRight("w-5 h-5 transform rotate-180 mr-1")} Back to list
          </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">{selectedEmail.subject}</h2>
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div>
            <span className="font-medium text-gray-700 dark:text-gray-300">{selectedEmail.sender}</span> to <span className="font-medium text-gray-700 dark:text-gray-300">{selectedEmail.recipient}</span>
          </div>
          <span>{new Date(selectedEmail.timestamp).toLocaleString()}</span>
        </div>
        <div className="mt-3 flex items-center space-x-4">
          <PriorityBadge priority={selectedEmail.priority} />
          <SentimentDisplay sentiment={currentSentiment} loading={sentimentLoading} />
           <div className="relative group">
            <select 
                value={selectedEmail.priority} 
                onChange={(e) => handlePriorityChange(e.target.value as EmailPriority)}
                className={`text-xs p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 ${focusRingClass}`}
            >
                {Object.values(EmailPriority).map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>
        {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
      </div>

      {/* AI Summary */}
      {(summaryLoading || summary) && (
        <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${aiSummaryBg}`}>
          <h3 className={`text-sm font-semibold ${aiSummaryTextColor} mb-1 flex items-center`}>
            {ICONS.sparkles("w-4 h-4 mr-1")}AI Summary
            {!summaryLoading && !summary && <button onClick={() => fetchSummary(selectedEmail.body, selectedEmail.id)} className={`ml-2 text-xs ${backButtonColor} hover:underline`}>Generate</button>}
          </h3>
          {summaryLoading && <LoadingSpinner size="sm" text="Generating summary..."/>}
          {summary && !summaryLoading && <p className="text-sm text-gray-700 dark:text-gray-300 italic">{summary}</p>}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 p-6 overflow-y-auto prose prose-sm dark:prose-invert max-w-none">
        {/* Using a div with dangerouslySetInnerHTML for rich text emails (simplified). In a real app, sanitize this. */}
        <div dangerouslySetInnerHTML={{ __html: selectedEmail.body.replace(/\n/g, '<br />') }} />
      </div>

      {/* Actions & Smart Replies */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex space-x-2 mb-4">
          <button className={`px-4 py-2 text-sm font-medium text-white ${replyButtonBg} ${replyButtonHoverBg} rounded-lg shadow-sm flex items-center space-x-2`}>
            {ICONS.user("w-4 h-4 transform rotate-[270deg]")} {/* Placeholder for Reply icon */}
            <span>Reply</span>
          </button>
          <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg shadow-sm flex items-center space-x-2">
            {ICONS.archive("w-4 h-4")}
            <span>Archive</span>
          </button>
          <button className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 dark:bg-red-700/30 hover:bg-red-200 dark:hover:bg-red-700/50 rounded-lg shadow-sm flex items-center space-x-2">
             {ICONS.trash("w-4 h-4")}
            <span>Delete</span>
          </button>
        </div>
        <SmartReplySection email={selectedEmail} />
      </div>
    </div>
  );
};

export default EmailDetailView;
