
import React from 'react';
import { Sentiment, EmailPriority, EmailCategory, UserProfile, AnalyticsChartData, AccentColorName, AccentColorDetails, FontSizeName, FontSizeDetails } from './types';

export const ICON_SIZE = "w-5 h-5";
export const LARGE_ICON_SIZE = "w-6 h-6";

export const ICONS = {
  inbox: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.25 2.25v3.75a2.25 2.25 0 01-2.25 2.25H2.25v-6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h3.86a2.25 2.25 0 012.25 2.25v3.75a2.25 2.25 0 01-2.25 2.25H2.25V3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-3.75A2.25 2.25 0 0114.25 15h3.86a2.25 2.25 0 012.25 2.25V21M12 3v3.75a2.25 2.25 0 012.25 2.25h3.86a2.25 2.25 0 012.25 2.25V12" /></svg>,
  filters: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.572a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" /></svg>,
  analytics: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-12M21 21l-6-6m0 0l-6.25-6.25M15 15h.008v.008H15V15z" /></svg>,
  settings: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.646.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.333.183-.582.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  search: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>,
  notification: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
  user: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  menu: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || LARGE_ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>,
  close: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || LARGE_ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>,
  chevronDown: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>,
  chevronRight: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>,
  star: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.82.61l-4.725-2.885a.563.563 0 00-.652 0l-4.725 2.885a.562.562 0 01-.82-.61l1.285-5.385a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>,
  archive: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>,
  trash: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12.56 0c1.153 0 2.243.09 3.288.255m-3.288-.255L6.311 5.31m0 0A23.969 23.969 0 0112 3c4.236 0 8.24 1.258 11.523 3.311" /></svg>,
  plus: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>,
  sun: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-6.364-.386l1.591-1.591M3 12h2.25m.386-6.364l1.591 1.591" /></svg>,
  moon: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118.25 15.75 9.75 9.75 0 018.5 6.002c0-1.89.548-3.664 1.502-5.119A9.75 9.75 0 002.25 9.75c0 5.385 4.365 9.75 9.75 9.75 2.034 0 3.924-.623 5.502-1.698z" /></svg>,
  checkCircle: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  xCircle: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  informationCircle: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>,
  sparkles: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 13.75M17 8.25L18.25 12" /></svg>,
  refresh: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>,
  reply: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>,
  tag: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>,
  users: (className?: string): React.ReactNode => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || ICON_SIZE}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-3.741-3.741M12 15a3 3 0 100-6 3 3 0 000 6z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c-1.612 0-3.223.393-4.671 1.105A9.06 9.06 0 0012 21c2.813 0 5.377-.912 7.373-2.45M12 12.75c2.5 0 4.672.951 6.136 2.453M12 12.75a9.079 9.079 0 01-3.741-.479 3 3 0 01-3.741-3.741M3.25 12.75c2.5 0 4.671.951 6.135 2.453A9.075 9.075 0 0012 21c2.813 0 5.377-.912 7.373-2.45M12 3v3.75m0 0a3.75 3.75 0 00-3.75 3.75S6 12 6 13.5s.98 2.625 2.25 2.625S12 15 12 13.5s-1.5-2.25-1.5-3.75S12 3.75 12 3.75zm0 0a3.75 3.75 0 013.75 3.75S18 12 18 13.5s-.98 2.625-2.25 2.625S12 15 12 13.5s1.5-2.25 1.5-3.75S12 3.75 12 3.75z" /></svg>,
};

export const ACCENT_COLOR_DETAILS: Record<AccentColorName, AccentColorDetails> = {
  blue: {
    name: 'Blue',
    colorName: 'blue',
    sidebarBg: 'bg-blue-800',
    sidebarActiveBg: 'bg-blue-700',
    buttonBg: 'bg-blue-600',
    buttonHoverBg: 'hover:bg-blue-700',
    text: 'text-blue-600',
    ring: 'ring-blue-500',
    focusRing: 'focus:ring-blue-500',
    toggleCheckedBg: 'bg-blue-600',
    barFill: '#3B82F6', // blue-500
    loaderBorder: 'border-blue-500',
    selectedItemBg: 'bg-blue-100',
    darkText: 'dark:text-blue-400',
    darkRing: 'dark:ring-blue-400',
    darkFocusRing: 'dark:focus:ring-blue-400',
    darkToggleCheckedBg: 'dark:bg-blue-500',
    darkSelectedItemBg: 'dark:bg-blue-900/50',
    darkButtonBg: 'dark:bg-blue-600',
    darkButtonHoverBg: 'dark:hover:bg-blue-500',
  },
  green: {
    name: 'Green',
    colorName: 'green',
    sidebarBg: 'bg-green-700',
    sidebarActiveBg: 'bg-green-600',
    buttonBg: 'bg-green-600',
    buttonHoverBg: 'hover:bg-green-700',
    text: 'text-green-600',
    ring: 'ring-green-500',
    focusRing: 'focus:ring-green-500',
    toggleCheckedBg: 'bg-green-600',
    barFill: '#10B981', // green-500
    loaderBorder: 'border-green-500',
    selectedItemBg: 'bg-green-100',
    darkText: 'dark:text-green-400',
    darkRing: 'dark:ring-green-400',
    darkFocusRing: 'dark:focus:ring-green-400',
    darkToggleCheckedBg: 'dark:bg-green-500',
    darkSelectedItemBg: 'dark:bg-green-900/50',
    darkButtonBg: 'dark:bg-green-600',
    darkButtonHoverBg: 'dark:hover:bg-green-500',
  },
  purple: {
    name: 'Purple',
    colorName: 'purple',
    sidebarBg: 'bg-purple-700',
    sidebarActiveBg: 'bg-purple-600',
    buttonBg: 'bg-purple-600',
    buttonHoverBg: 'hover:bg-purple-700',
    text: 'text-purple-600',
    ring: 'ring-purple-500',
    focusRing: 'focus:ring-purple-500',
    toggleCheckedBg: 'bg-purple-600',
    barFill: '#8B5CF6', // purple-500
    loaderBorder: 'border-purple-500',
    selectedItemBg: 'bg-purple-100',
    darkText: 'dark:text-purple-400',
    darkRing: 'dark:ring-purple-400',
    darkFocusRing: 'dark:focus:ring-purple-400',
    darkToggleCheckedBg: 'dark:bg-purple-500',
    darkSelectedItemBg: 'dark:bg-purple-900/50',
    darkButtonBg: 'dark:bg-purple-600',
    darkButtonHoverBg: 'dark:hover:bg-purple-500',
  },
};

export const FONT_SIZE_DETAILS: Record<FontSizeName, FontSizeDetails> = {
  small: { name: 'Small', rootSize: '14px' },
  normal: { name: 'Normal', rootSize: '16px' },
  large: { name: 'Large', rootSize: '18px' },
};


export const GEMINI_MODEL_TEXT = 'gemini-2.5-flash-preview-04-17';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Demo User',
  email: 'user@example.com',
  avatarUrl: `https://avatar.iran.liara.run/beam/100/${encodeURIComponent('Demo User')}.svg`, // Generic appealing avatar
};

export const PRIORITY_CONFIG: Record<EmailPriority, { label: string; color: string }> = {
  [EmailPriority.High]: { label: 'High', color: 'bg-red-500 dark:bg-red-600' },
  [EmailPriority.Medium]: { label: 'Medium', color: 'bg-yellow-500 dark:bg-yellow-600' },
  [EmailPriority.Low]: { label: 'Low', color: 'bg-green-500 dark:bg-green-600' },
  [EmailPriority.None]: { label: 'None', color: 'bg-gray-400 dark:bg-gray-500' },
};

export const SENTIMENT_CONFIG: Record<Sentiment, { label: string; color: string; }> = {
  [Sentiment.Positive]: { label: 'Positive', color: 'text-green-600 dark:text-green-400' },
  [Sentiment.Negative]: { label: 'Negative', color: 'text-red-600 dark:text-red-400' },
  [Sentiment.Neutral]: { label: 'Neutral', color: 'text-yellow-600 dark:text-yellow-400' },
  [Sentiment.Mixed]: { label: 'Mixed', color: 'text-blue-600 dark:text-blue-400' }, // This was blue, keep as is or make accent? For now, keep as specific.
  [Sentiment.Unknown]: { label: 'Unknown', color: 'text-gray-500 dark:text-gray-400' },
};

export const EMAIL_CATEGORY_TABS: { name: EmailCategory; label: string; icon: (className?: string) => React.ReactNode }[] = [
  { name: EmailCategory.Inbox, label: 'Inbox', icon: ICONS.inbox },
  { name: EmailCategory.Priority, label: 'Priority', icon: ICONS.star },
  { name: EmailCategory.Promotions, label: 'Promotions', icon: ICONS.tag },
  { name: EmailCategory.Social, label: 'Social', icon: ICONS.users },
  { name: EmailCategory.Archived, label: 'Archived', icon: ICONS.archive },
  { name: EmailCategory.Spam, label: 'Spam', icon: ICONS.trash },
];

export const MOCK_REPORTS_DATA: {
  volumeTrend: AnalyticsChartData[];
  sentimentDistribution: AnalyticsChartData[];
  filterAccuracy: AnalyticsChartData[];
} = {
  volumeTrend: [
    { name: 'Mon', value: 30 },
    { name: 'Tue', value: 45 },
    { name: 'Wed', value: 60 },
    { name: 'Thu', value: 50 },
    { name: 'Fri', value: 75 },
    { name: 'Sat', value: 40 },
    { name: 'Sun', value: 35 },
  ],
  sentimentDistribution: [
    { name: Sentiment.Positive, value: 120 },
    { name: Sentiment.Negative, value: 30 },
    { name: Sentiment.Neutral, value: 80 },
    { name: Sentiment.Mixed, value: 15 },
  ],
  filterAccuracy: [ // Used textually in AnalyticsPage
    { name: 'Correctly Filtered', value: 1900 },
    { name: 'False Positives', value: 50 },
    { name: 'False Negatives', value: 25 },
  ],
};