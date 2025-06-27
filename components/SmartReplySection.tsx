
import React, { useState, useCallback, useContext } from 'react';
import { Email, SmartReply, AppTheme } from '../types';
import { getSmartReplies } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { ICONS, ACCENT_COLOR_DETAILS } from '../constants';
import { ThemeContext } from '../contexts';

interface SmartReplySectionProps {
  email: Email;
}

const API_KEY_MISSING_MESSAGE = "Could not generate replies (API key missing).";

const SmartReplySection: React.FC<SmartReplySectionProps> = ({ email }) => {
  const [replies, setReplies] = useState<SmartReply[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error("ThemeContext not found");
  const { theme, accentColor } = themeContext;
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];

  const fetchReplies = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const suggestedRepliesTexts = await getSmartReplies(email.body, `Subject: ${email.subject}\nFrom: ${email.sender}`);
      
      if (suggestedRepliesTexts.length === 1 && suggestedRepliesTexts[0] === API_KEY_MISSING_MESSAGE) {
        setError("Smart replies are unavailable. Please ensure your Gemini API key is correctly configured.");
        setReplies([]);
      } else {
        setReplies(suggestedRepliesTexts.map((text, index) => ({ id: `reply-${index}`, text })));
      }
    } catch (err) {
      setError("Failed to fetch smart replies. An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [email]);

  // Fetch replies when component mounts or email changes
  React.useEffect(() => {
    if (email.body) { // Only fetch if there's content
        fetchReplies();
    } else {
        setReplies([]); // Clear replies if no body
        setError(null); // Clear any previous errors
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email.id]); // Re-fetch if email ID changes

  const handleReplyClick = (replyText: string) => {
    // In a real app, this would open a compose window with the reply pre-filled
    alert(`Reply selected: "${replyText}"`);
  };
  
  const sparklesIconColor = theme === AppTheme.Dark ? accentDetails.darkText : accentDetails.text;
  const focusRingClass = theme === AppTheme.Dark ? accentDetails.darkFocusRing : accentDetails.focusRing;
  const replyButtonHoverBg = theme === AppTheme.Dark 
    ? `dark:hover:bg-${accentDetails.colorName}-700/50` 
    : `hover:bg-${accentDetails.colorName}-50`;


  return (
    <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow">
      <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-3 flex items-center">
        {ICONS.sparkles(`w-5 h-5 mr-2 ${sparklesIconColor}`)}
        Smart Replies
        <button 
          onClick={fetchReplies} 
          disabled={isLoading}
          className="ml-auto p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
          title="Refresh suggestions"
        >
          {ICONS.refresh(isLoading ? "w-4 h-4 animate-spin" : "w-4 h-4")}
        </button>
      </h3>
      {isLoading && <div className="flex justify-center py-4"><LoadingSpinner size="sm" /></div>}
      {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
      {!isLoading && !error && replies.length === 0 && (
        <p className="text-sm text-gray-500 dark:text-gray-400">No smart replies available for this email.</p>
      )}
      {!isLoading && !error && replies.length > 0 && (
        <div className="space-y-2">
          {replies.map((reply) => (
            <button
              key={reply.id}
              onClick={() => handleReplyClick(reply.text)}
              className={`w-full text-left px-3 py-2 text-sm bg-white dark:bg-gray-600 ${replyButtonHoverBg} rounded-md shadow-sm border border-gray-200 dark:border-gray-500 focus:outline-none focus:ring-2 ${focusRingClass} transition-colors`}
            >
              {reply.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartReplySection;
