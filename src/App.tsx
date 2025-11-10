import { useState, useMemo } from 'react';
import { ContentItem } from './types';
import { sampleContent } from './data/sampleContent';
import ContentCard from './components/ContentCard';
import ContentViewer from './components/ContentViewer';
import SearchBar from './components/SearchBar';
import { Search, Bookmark } from 'lucide-react';

function App() {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFilter, setCurrentFilter] = useState('all');
  const [content] = useState<ContentItem[]>(sampleContent);

  const filteredContent = useMemo(() => {
    let filtered = [...content];

    // Apply filter
    if (currentFilter !== 'all') {
      filtered = filtered.filter(item => item.category === currentFilter);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  }, [searchQuery, currentFilter, content]);


  const handleContentClick = (item: ContentItem) => {
    setSelectedContent(item);
  };

  const handleCloseViewer = () => {
    setSelectedContent(null);
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold text-gray-900">Redwrite</h1>
              <nav className="hidden md:flex items-center gap-6">
                <a href="/contact.html" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
              </nav>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Search">
                <Search className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Bookmarks">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Redefining the future<br />
            <span className="text-soft-purple">with AI</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover cutting-edge insights, breakthrough research, and practical applications that are shaping tomorrow's intelligent systems.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Explore Articles →
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchBar
          onSearch={setSearchQuery}
          onFilterChange={setCurrentFilter}
          currentFilter={currentFilter}
        />

        {/* Content Grid */}
        {filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContent.map((item) => (
              <ContentCard
                key={item.id}
                item={item}
                onClick={handleContentClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No content found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters.
            </p>
          </div>
        )}
      </main>

      {/* Content Viewer Modal */}
      <ContentViewer
        item={selectedContent}
        onClose={handleCloseViewer}
      />
    </div>
  );
}

export default App;