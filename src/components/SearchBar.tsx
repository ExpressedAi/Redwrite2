import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilterChange: (filter: string) => void;
  currentFilter: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilterChange, currentFilter }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const filters = ['all', 'Applications', 'Articles', 'Research', 'Trade Secrets', 'Writing'];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-6 mb-8">
      <form onSubmit={handleSearch} className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-purple focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="bg-soft-purple hover:bg-pastel-purple text-gray-700 px-6 py-3 rounded-xl transition-colors font-medium"
        >
          Search
        </button>
      </form>
      
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-600 mr-3">Filter by category:</span>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                currentFilter === filter
                  ? 'bg-soft-purple text-gray-700'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
              }`}
            >
              {filter === 'all' ? 'All' : filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;