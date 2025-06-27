

export interface Email {
  id: string;
  sender: string;
  senderAvatar?: string;
  recipient: string; 
  subject: string;
  body: string;
  timestamp: Date;
  read: boolean;
  priority: EmailPriority;
  sentiment?: Sentiment;
  category: EmailCategory;
  tags?: string[];
  attachments?: { name: string; size: string; type: string }[];
  summary?: string; // AI generated summary
}

export enum EmailPriority {
  High = "High",
  Medium = "Medium",
  Low = "Low",
  None = "None",
}

export enum Sentiment {
  Positive = "Positive",
  Negative = "Negative",
  Neutral = "Neutral",
  Mixed = "Mixed",
  Unknown = "Unknown",
}

export enum EmailCategory {
  Inbox = "Inbox",
  Priority = "Priority",
  Promotions = "Promotions",
  Social = "Social",
  Spam = "Spam",
  Archived = "Archived",
  Sent = "Sent",
  Drafts = "Drafts",
}

export interface FilterRule {
  id: string;
  name: string;
  isActive: boolean;
  conditions: FilterCondition[]; 
  action: FilterAction;
}

export interface FilterCondition {
  id: string; // unique id for react keys
  field: "sender" | "subject" | "body" | "sentiment" | "priorityScore";
  operator: "contains" | "notContains" | "equals" | "startsWith" | "endsWith" | "matchesRegex" | "is" | "isNot" | "greaterThan" | "lessThan";
  value: string | number | Sentiment | EmailPriority;
}

export interface FilterAction {
  type: "moveToCategory" | "setPriority" | "forwardTo" | "autoReply" | "markAsRead" | "delete";
  category?: EmailCategory;
  priority?: EmailPriority;
  forwardEmail?: string;
  replyTemplateId?: string; 
}

export interface StatsData {
  totalEmails: number;
  filteredToday: number;
  priorityItems: number;
  responseRate: number; // percentage
}

export interface AnalyticsChartData {
  name: string;
  value: number;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
}

// For Gemini Service
export interface SmartReply {
  id: string;
  text: string;
}

export enum AppTheme {
  Light = "light",
  Dark = "dark",
}

export type AccentColorName = 'blue' | 'green' | 'purple';

export interface AccentColorDetails {
  name: string;
  colorName: AccentColorName; // For constructing dynamic classes e.g. ring-blue-500
  // Light theme or general
  sidebarBg: string;
  sidebarActiveBg: string;
  buttonBg: string;
  buttonHoverBg: string;
  text: string;
  ring: string; // e.g. ring-blue-500
  focusRing: string; // e.g. focus:ring-blue-500
  toggleCheckedBg: string;
  barFill: string; // hex for charts
  loaderBorder: string; // e.g. border-blue-500
  selectedItemBg: string;
  // Dark theme specific (will often be different shades or direct overrides)
  darkText: string;
  darkRing: string;
  darkFocusRing: string;
  darkToggleCheckedBg: string;
  darkSelectedItemBg: string; // e.g. dark:bg-blue-900/50 - ensure good contrast
  darkButtonBg?: string; // Optional: if dark theme needs a different base button color for this accent
  darkButtonHoverBg?: string; // Optional
}

export type FontSizeName = 'small' | 'normal' | 'large';

export interface FontSizeDetails {
  name: string; // e.g., 'Small'
  rootSize: string; // e.g., '14px' for the html element
}

export interface ThemeContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  accentColor: AccentColorName;
  changeAccentColor: (color: AccentColorName) => void;
  fontSize: FontSizeName;
  changeFontSize: (size: FontSizeName) => void;
}