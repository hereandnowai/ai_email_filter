
import React, { useState, useContext, useCallback } from 'react';
import FilterConfigModal from '../components/FilterConfigModal';
import { FilterRule, AppTheme } from '../types';
import { ICONS, ACCENT_COLOR_DETAILS } from '../constants';
import { FilterContext, ThemeContext } from '../contexts';
import ToggleSwitch from '../components/ToggleSwitch';

const FiltersPage: React.FC = () => {
  const filterContext = useContext(FilterContext);
  if (!filterContext) throw new Error("FilterContext not found");
  const { filters, addFilter, updateFilter, deleteFilter } = filterContext;

  const themeContext = useContext(ThemeContext);
  if (!themeContext) throw new Error("ThemeContext not found");
  const { theme, accentColor } = themeContext;
  const accentDetails = ACCENT_COLOR_DETAILS[accentColor];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFilter, setEditingFilter] = useState<FilterRule | null>(null);

  const openCreateModal = () => {
    setEditingFilter(null);
    setIsModalOpen(true);
  };

  const openEditModal = (filter: FilterRule) => {
    setEditingFilter(filter);
    setIsModalOpen(true);
  };

  const handleToggleActive = useCallback((filterId: string, isActive: boolean) => {
    const filterToUpdate = filters.find(f => f.id === filterId);
    if (filterToUpdate) {
      updateFilter({ ...filterToUpdate, isActive });
    }
  }, [filters, updateFilter]);

  const createButtonBg = theme === AppTheme.Dark ? accentDetails.darkButtonBg || accentDetails.buttonBg : accentDetails.buttonBg;
  const createButtonHoverBg = theme === AppTheme.Dark ? accentDetails.darkButtonHoverBg || accentDetails.buttonHoverBg : accentDetails.buttonHoverBg;
  const filterNameColor = theme === AppTheme.Dark ? accentDetails.darkText : accentDetails.text;
  const editButtonColor = theme === AppTheme.Dark ? accentDetails.darkText : accentDetails.text;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Manage Filters</h1>
        <button
          onClick={openCreateModal}
          className={`${createButtonBg} ${createButtonHoverBg} text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 flex items-center space-x-2`}
        >
          {ICONS.plus("w-5 h-5")}
          <span>Create New Filter</span>
        </button>
      </div>

      {filters.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          {ICONS.filters("w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4")}
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">No Filters Yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">Create filters to automatically organize your emails.</p>
          <button
            onClick={openCreateModal}
            className={`${createButtonBg} ${createButtonHoverBg} text-white font-medium py-2 px-4 rounded-lg flex items-center space-x-2 mx-auto`}
          >
            {ICONS.plus("w-5 h-5")}
            <span>Create Your First Filter</span>
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {filters.map((filter) => (
              <li key={filter.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-lg font-semibold ${filterNameColor} truncate`}>{filter.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {filter.conditions.length} condition(s) &rarr; {filter.action.type}
                      {filter.action.category && ` to ${filter.action.category}`}
                      {filter.action.priority && ` as ${filter.action.priority}`}
                    </p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-6 flex items-center space-x-4 flex-shrink-0">
                    <ToggleSwitch 
                        checked={filter.isActive} 
                        onChange={(isChecked) => handleToggleActive(filter.id, isChecked)}
                        id={`filter-active-${filter.id}`}
                    />
                    <button
                      onClick={() => openEditModal(filter)}
                      className={`text-sm font-medium ${editButtonColor} hover:underline`}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFilter(filter.id)}
                      className="text-sm font-medium text-red-600 dark:text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <FilterConfigModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        filterToEdit={editingFilter}
      />
    </div>
  );
};

export default FiltersPage;
