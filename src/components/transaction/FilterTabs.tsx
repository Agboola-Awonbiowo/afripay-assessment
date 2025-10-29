import React from 'react';
import { FilterType } from '@/types';

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  transactionCounts: {
    all: number;
    credit: number;
    debit: number;
  };
}

const FilterTabs: React.FC<FilterTabsProps> = ({
  activeFilter,
  onFilterChange,
  transactionCounts,
}) => {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: transactionCounts.all },
    { key: 'credit', label: 'Credits', count: transactionCounts.credit },
    { key: 'debit', label: 'Debits', count: transactionCounts.debit },
  ];

  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`
              py-2 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeFilter === filter.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            {filter.label}
            <span
              className={`
                ml-2 py-0.5 px-2 rounded-full text-xs
                ${
                  activeFilter === filter.key
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }
              `}
            >
              {filter.count}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default FilterTabs;
