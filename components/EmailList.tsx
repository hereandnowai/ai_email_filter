import React, { useContext, useCallback } from 'react';
import { Email, EmailPriority }
from '../types';
import EmailListItem from './EmailListItem';
import LoadingSpinner from './LoadingSpinner';
import { EmailContext } from '../contexts';

interface EmailListProps {
  emails: Email[];
  isLoading?: boolean;
  customEmptyMessage?: { title: string; text: string } | null;
}

const EmailList: React.FC<EmailListProps> = ({ emails, isLoading, customEmptyMessage }) => {
  const emailContext = useContext(EmailContext);
  if (!emailContext) throw new Error("EmailContext not found");
  const { selectedEmail, selectEmail, updateEmail } = emailContext;

  const handleTogglePriority = useCallback((emailId: string, newPriority: EmailPriority) => {
    const emailToUpdate = emails.find(e => e.id === emailId);
    if (emailToUpdate) {
      updateEmail({ ...emailToUpdate, priority: newPriority });
    }
  }, [emails, updateEmail]);


  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <LoadingSpinner text="Loading emails..." />
      </div>
    );
  }

  if (emails.length === 0) {
    const title = customEmptyMessage?.title || "No emails here";
    const text = customEmptyMessage?.text || "This folder is currently empty.";
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-10.438-5.613M21.75 9H2.25m19.5 0v-2.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125V9z" />
        </svg>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-sm">{text}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 overflow-y-auto h-full rounded-lg shadow">
      {emails.map((email) => (
        <EmailListItem
          key={email.id}
          email={email}
          isSelected={selectedEmail?.id === email.id}
          onSelectEmail={selectEmail}
          onTogglePriority={handleTogglePriority}
        />
      ))}
    </div>
  );
};

export default EmailList;