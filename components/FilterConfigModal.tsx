
import React, { useState, useEffect, useContext, useCallback } from 'react';
import { FilterRule, FilterCondition, FilterAction, EmailCategory, EmailPriority, Sentiment, AppTheme } from '../types';
import { ICONS, ACCENT_COLOR_DETAILS } from '../constants';
import { FilterContext, ThemeContext } from '../contexts';
import ToggleSwitch from './ToggleSwitch';

interface FilterConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterToEdit?: FilterRule | null;
}

const initialCondition: Omit<FilterCondition, 'id'> = { field: 'subject', operator: 'contains', value: '' };
const initialAction: FilterAction = { type: 'moveToCategory', category: EmailCategory.Inbox };

const FilterConfigModal: React.FC<FilterConfigModalProps> = ({ isOpen, onClose, filterToEdit }) => {
  const filterContext = useContext(FilterContext);
  if (!filterContext) throw new Error("FilterContext not found");
  const { addFilter, updateFilter } = filterContext;

  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error("ThemeContext not found");
  const { theme, accentColor } = themeContext;
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];

  const [name, setName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [conditions, setConditions] = useState<FilterCondition[]>([{ ...initialCondition, id: Date.now().toString() }]);
  const [action, setAction] = useState<FilterAction>(initialAction);

  useEffect(() => {
    if (filterToEdit) {
      setName(filterToEdit.name);
      setIsActive(filterToEdit.isActive);
      setConditions(filterToEdit.conditions.map(c => ({...c, id: c.id || Date.now().toString() + Math.random()}))); // ensure id
      setAction(filterToEdit.action);
    } else {
      setName('');
      setIsActive(true);
      setConditions([{ ...initialCondition, id: Date.now().toString() }]);
      setAction(initialAction);
    }
  }, [filterToEdit, isOpen]);

  const handleConditionChange = <K extends keyof FilterCondition, V extends FilterCondition[K]>(index: number, field: K, value: V) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], [field]: value };
    // Reset value if field changes to something incompatible
    if (field === 'field') {
        newConditions[index].value = ''; // Reset value when field type changes
        if (value === 'sentiment') newConditions[index].operator = 'is';
        else if (value === 'priorityScore') newConditions[index].operator = 'equals';
        else newConditions[index].operator = 'contains';
    }
    setConditions(newConditions);
  };

  const addCondition = () => {
    setConditions([...conditions, { ...initialCondition, id: Date.now().toString() + Math.random() }]);
  };

  const removeCondition = (index: number) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter((_, i) => i !== index));
    }
  };

  const handleActionChange = <K extends keyof FilterAction, V extends FilterAction[K]>(field: K, value: V) => {
    const newAction = { ...action, [field]: value };
    // Reset related fields if action type changes
    if (field === 'type') {
        if (value === 'moveToCategory') newAction.category = EmailCategory.Inbox;
        else delete newAction.category;

        if (value === 'setPriority') newAction.priority = EmailPriority.Medium;
        else delete newAction.priority;
        
        if (value === 'forwardTo') newAction.forwardEmail = '';
        else delete newAction.forwardEmail;
    }
    setAction(newAction);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
        alert("Filter name cannot be empty.");
        return;
    }
    const newFilter: FilterRule = {
      id: filterToEdit?.id || Date.now().toString(),
      name,
      isActive,
      conditions,
      action,
    };
    if (filterToEdit) {
      updateFilter(newFilter);
    } else {
      addFilter(newFilter);
    }
    onClose();
  };

  if (!isOpen) return null;
  
  const focusRingClass = theme === AppTheme.Dark ? accentDetails.darkFocusRing : accentDetails.focusRing;
  const inputBaseClass = `p-2 border border-gray-300 dark:border-gray-600 rounded-md w-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 ${focusRingClass}`;
  const selectBaseClass = `${inputBaseClass}`; // Selects share similar styling
  
  const addConditionTextColor = theme === AppTheme.Dark ? accentDetails.darkText : accentDetails.text;
  const submitButtonBg = theme === AppTheme.Dark ? accentDetails.darkButtonBg || accentDetails.buttonBg : accentDetails.buttonBg;
  const submitButtonHoverBg = theme === AppTheme.Dark ? accentDetails.darkButtonHoverBg || accentDetails.buttonHoverBg : accentDetails.buttonHoverBg;
  const submitButtonFocusRing = theme === AppTheme.Dark ? accentDetails.darkFocusRing : accentDetails.focusRing;


  const renderConditionValueInput = (condition: FilterCondition, index: number) => {
    switch (condition.field) {
      case 'sentiment':
        return (
          <select
            value={condition.value as Sentiment || ''}
            onChange={(e) => handleConditionChange(index, 'value', e.target.value as Sentiment)}
            className={selectBaseClass}
          >
            {Object.values(Sentiment).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        );
      case 'priorityScore': // Assuming priority score is numeric, simplified for now
         return (
          <select
            value={condition.value as EmailPriority || ''}
            onChange={(e) => handleConditionChange(index, 'value', e.target.value as EmailPriority)}
            className={selectBaseClass}
          >
            {Object.values(EmailPriority).map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        );
      default:
        return (
          <input
            type="text"
            value={condition.value as string || ''}
            onChange={(e) => handleConditionChange(index, 'value', e.target.value)}
            className={inputBaseClass}
            placeholder="Value"
          />
        );
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 print:hidden">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            {filterToEdit ? 'Edit Filter' : 'Create New Filter'}
          </h2>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
            {ICONS.close()}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto pr-2 space-y-6">
          <div>
            <label htmlFor="filterName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Filter Name</label>
            <input
              type="text"
              id="filterName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${inputBaseClass} focus:${submitButtonFocusRing}`}
              placeholder="e.g., Urgent Project Updates"
              required
            />
          </div>

          <div className="flex items-center space-x-3">
             <label htmlFor="filterIsActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">Active</label>
            <ToggleSwitch id="filterIsActive" checked={isActive} onChange={setIsActive} />
          </div>

          {/* Conditions */}
          <fieldset className="border border-gray-300 dark:border-gray-600 p-4 rounded-md">
            <legend className="text-sm font-medium px-1 text-gray-700 dark:text-gray-300">Conditions (ALL must match)</legend>
            <div className="space-y-4">
            {conditions.map((condition, index) => (
              <div key={condition.id} className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                <select
                  value={condition.field}
                  onChange={(e) => handleConditionChange(index, 'field', e.target.value as FilterCondition['field'])}
                  className={`md:col-span-3 ${selectBaseClass}`}
                >
                  <option value="subject">Subject</option>
                  <option value="sender">Sender</option>
                  <option value="body">Body Content</option>
                  <option value="sentiment">Sentiment</option>
                  <option value="priorityScore">Priority</option>
                </select>
                <select
                  value={condition.operator}
                  onChange={(e) => handleConditionChange(index, 'operator', e.target.value as FilterCondition['operator'])}
                  className={`md:col-span-3 ${selectBaseClass}`}
                >
                  {condition.field === 'sentiment' || condition.field === 'priorityScore' ? (
                    <>
                      <option value="is">Is</option>
                      <option value="isNot">Is Not</option>
                    </>
                  ) : (
                    <>
                      <option value="contains">Contains</option>
                      <option value="notContains">Does Not Contain</option>
                      <option value="equals">Equals</option>
                      <option value="startsWith">Starts With</option>
                      <option value="endsWith">Ends With</option>
                      <option value="matchesRegex">Matches Regex</option>
                    </>
                  )}
                </select>
                <div className="md:col-span-5">
                 {renderConditionValueInput(condition, index)}
                </div>
                <button
                  type="button"
                  onClick={() => removeCondition(index)}
                  disabled={conditions.length === 1}
                  className="md:col-span-1 p-2 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center"
                >
                  {ICONS.trash("w-5 h-5")}
                </button>
              </div>
            ))}
            </div>
            <button
              type="button"
              onClick={addCondition}
              className={`mt-3 text-sm ${addConditionTextColor} hover:underline flex items-center`}
            >
             {ICONS.plus("w-4 h-4 mr-1")} Add Condition
            </button>
          </fieldset>

          {/* Action */}
           <fieldset className="border border-gray-300 dark:border-gray-600 p-4 rounded-md">
            <legend className="text-sm font-medium px-1 text-gray-700 dark:text-gray-300">Action</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select
                value={action.type}
                onChange={(e) => handleActionChange('type', e.target.value as FilterAction['type'])}
                className={selectBaseClass}
                >
                <option value="moveToCategory">Move to Category</option>
                <option value="setPriority">Set Priority</option>
                <option value="markAsRead">Mark as Read</option>
                <option value="delete">Delete Email</option>
                <option value="forwardTo">Forward To</option>
                {/* <option value="autoReply">Auto Reply</option> */} {/* Auto-reply needs template system, simplified for now */}
                </select>

                {action.type === 'moveToCategory' && (
                <select
                    value={action.category || ''}
                    onChange={(e) => handleActionChange('category', e.target.value as EmailCategory)}
                    className={selectBaseClass}
                >
                    {Object.values(EmailCategory).filter(c => c !== EmailCategory.Sent && c !== EmailCategory.Drafts).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                )}
                {action.type === 'setPriority' && (
                <select
                    value={action.priority || ''}
                    onChange={(e) => handleActionChange('priority', e.target.value as EmailPriority)}
                    className={selectBaseClass}
                >
                    {Object.values(EmailPriority).map(pri => (
                    <option key={pri} value={pri}>{pri}</option>
                    ))}
                </select>
                )}
                {action.type === 'forwardTo' && (
                  <input
                    type="email"
                    placeholder="Forwarding email address"
                    value={action.forwardEmail || ''}
                    onChange={(e) => handleActionChange('forwardEmail', e.target.value)}
                    className={inputBaseClass}
                  />
                )}
            </div>
           </fieldset>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-sm font-medium text-white ${submitButtonBg} ${submitButtonHoverBg} rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${submitButtonFocusRing} dark:focus:ring-offset-gray-800`}
            >
              {filterToEdit ? 'Save Changes' : 'Create Filter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FilterConfigModal;
