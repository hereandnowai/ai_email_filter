
import React from 'react';
import { Email, FilterRule, AppTheme, AccentColorName, FontSizeName } from './types';

export interface EmailContextType {
  emails: Email[];
  originalEmails: Email[]; // Unfiltered emails
  selectedEmail: Email | null;
  selectEmail: (email: Email | null) => void;
  updateEmail: (updatedEmail: Email) => void;
  refreshEmails: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const EmailContext = React.createContext<EmailContextType | undefined>(undefined);

export interface FilterContextType {
  filters: FilterRule[];
  addFilter: (filter: FilterRule) => void;
  updateFilter: (filter: FilterRule) => void;
  deleteFilter: (filterId: string) => void;
}

export const FilterContext = React.createContext<FilterContextType | undefined>(undefined);

export interface ThemeContextType {
  theme: AppTheme;
  toggleTheme: () => void;
  accentColor: AccentColorName;
  changeAccentColor: (color: AccentColorName) => void;
  fontSize: FontSizeName;
  changeFontSize: (size: FontSizeName) => void;
}
export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);