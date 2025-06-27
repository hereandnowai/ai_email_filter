
import React, { useMemo, useContext } from 'react';
import { Email, EmailPriority, AppTheme } from '../types';
import PriorityBadge from './PriorityBadge';
import SentimentDisplay from './SentimentDisplay';
import { ICONS, ACCENT_COLOR_DETAILS } from '../constants';
import { ThemeContext } from '../contexts';

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onSelectEmail: (email: Email) => void;
  onTogglePriority: (emailId: string, newPriority: EmailPriority) => void; 
}

const EmailListItem: React.FC<EmailListItemProps> = ({ email, isSelected, onSelectEmail, onTogglePriority }) => {
  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error("ThemeContext not found");
  const { theme, accentColor } = themeContext;
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];

  const formattedDate = useMemo(() => {
    const date = new Date(email.timestamp);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  }, [email.timestamp]);

  const handlePriorityToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent email selection when clicking star
    const newPriority = email.priority === EmailPriority.High ? EmailPriority.None : EmailPriority.High;
    onTogglePriority(email.id, newPriority);
  };
  
  const avatarUrl = email.senderAvatar || `https://picsum.photos/seed/${email.sender.replace(/\s+/g, '')}/40/40`;

  const selectedBgClass = isSelected 
    ? (theme === AppTheme.Dark ? accentDetails.darkSelectedItemBg : accentDetails.selectedItemBg)
    : '';

  return (
    <div
      onClick={() => onSelectEmail(email)}
      className={`flex items-start p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer transition-colors duration-150
                  ${selectedBgClass || 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                  ${!email.read ? 'bg-white dark:bg-gray-800 font-semibold' : 'bg-gray-50/50 dark:bg-gray-800/50'}`}
    >
      <img src={avatarUrl} alt={email.sender} className="w-10 h-10 rounded-full mr-3" />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <span className={`text-sm truncate ${!email.read ? 'text-gray-800 dark:text-gray-100' : 'text-gray-600 dark:text-gray-300'}`}>
            {email.sender}
          </span>
          <span className={`text-xs ${!email.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {formattedDate}
          </span>
        </div>
        <p className={`text-sm truncate mb-1 ${!email.read ? 'text-gray-700 dark:text-gray-200' : 'text-gray-700 dark:text-gray-300'}`}>
          {email.subject}
        </p>
        <p className={`text-xs text-gray-500 dark:text-gray-400 truncate mb-1`}>
          {email.summary || email.body.substring(0, 60) + (email.body.length > 60 ? '...' : '')}
        </p>
        <div className="flex items-center space-x-2 mt-1">
          <PriorityBadge priority={email.priority} />
          <SentimentDisplay sentiment={email.sentiment} />
        </div>
      </div>
      <div className="ml-2 flex flex-col items-center space-y-1">
        <button onClick={handlePriorityToggle} className={`p-1 rounded-full hover:bg-yellow-100 dark:hover:bg-yellow-700/50 
          ${email.priority === EmailPriority.High ? 'text-yellow-500 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'}`}>
          {ICONS.star(email.priority === EmailPriority.High ? "w-5 h-5 fill-current" : "w-5 h-5")}
        </button>
        {email.attachments && email.attachments.length > 0 && (
          <span className="text-gray-400 dark:text-gray-500">{ICONS.archive("w-4 h-4")}</span>
        )}
      </div>
    </div>
  );
};

export default React.memo(EmailListItem);
