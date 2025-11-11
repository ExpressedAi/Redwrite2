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
    <div className="glass p-6 mb-8">
      <form onSubmit={handleSearch} className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-silver-500 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search content..."
            className="w-full pl-10 pr-4 py-3 border border-mist rounded-xl focus:outline-none focus:ring-2 focus:ring-delta-blue/50 focus:border-delta-blue bg-snow/50 backdrop-blur-sm text-graphite-900 placeholder-silver-500 font-sans transition-all duration-micro ease-snap"
          />
        </div>
        <button
          type="submit"
          className="btn-primary px-6 py-3 font-sans font-medium"
        >
          Search
        </button>
      </form>

      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-silver-500" />
        <span className="text-sm text-graphite-700 mr-3 font-sans">Filter by category:</span>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-3 py-1 rounded-full text-sm transition-all duration-micro ease-snap font-sans ${
                currentFilter === filter
                  ? 'bg-delta-blue text-snow shadow-sm'
                  : 'bg-mist hover:bg-cloud text-graphite-700'
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