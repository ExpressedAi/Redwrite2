import React from 'react';
import { ContentItem } from '../types';
import { Clock, Play, FileText, Headphones, File, Video, BookOpen, Sparkles } from 'lucide-react';

interface ContentCardProps {
  item: ContentItem;
  onClick: (item: ContentItem) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, onClick }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'video':
        return <Video className="w-8 h-8" />;
      case 'audio':
        return <Headphones className="w-8 h-8" />;
      case 'pdf':
      case 'document':
        return <FileText className="w-8 h-8" />;
      default:
        return <BookOpen className="w-8 h-8" />;
    }
  };

  const getCardColor = () => {
    switch (item.category) {
      case 'Applications':
        return 'bg-gradient-to-br from-blue-400 to-cyan-500';
      case 'Articles':
        return 'bg-gradient-to-br from-purple-400 to-pink-500';
      case 'Research':
        return 'bg-gradient-to-br from-emerald-400 to-teal-500';
      case 'Trade Secrets':
        return 'bg-gradient-to-br from-amber-400 to-orange-500';
      case 'Writing':
        return 'bg-gradient-to-br from-indigo-400 to-purple-500';
      default:
        return 'bg-gradient-to-br from-gray-400 to-gray-500';
    }
  };

  const getDuration = () => {
    if (item.type === 'video' || item.type === 'audio') {
      return `${item.duration}m`;
    }
    return `${item.readTime}m read`;
  };

  return (
    <div
      onClick={() => onClick(item)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100/50"
    >
      <div className={`relative ${getCardColor()} h-32 flex items-center justify-center`}>
        <div className="text-gray-600">
          {getIcon()}
        </div>
        {item.isOriginalResearch && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold shadow-lg">
            <Sparkles className="w-3 h-3" />
            Original Research
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-gray-600 text-xs px-3 py-1 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {getDuration()}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-pastel-blue text-gray-600 text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <h3 className="font-semibold text-gray-800 text-lg mb-2 group-hover:text-gray-600 transition-colors">
          {item.title}
        </h3>
        
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>{item.author}</span>
          <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;