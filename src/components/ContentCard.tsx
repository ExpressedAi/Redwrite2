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
        return 'bg-gradient-to-br from-delta-blue/20 to-mint/30';
      case 'Articles':
        return 'bg-gradient-to-br from-orchid/20 to-delta-blue/20';
      case 'Research':
        return 'bg-gradient-to-br from-mint/30 to-delta-blue/20';
      case 'Trade Secrets':
        return 'bg-gradient-to-br from-amber/30 to-orchid/20';
      case 'Writing':
        return 'bg-gradient-to-br from-orchid/30 to-mint/20';
      default:
        return 'bg-gradient-to-br from-mist to-cloud';
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
      className="glass hover:shadow-lg transition-all duration-ui ease-snap cursor-pointer group overflow-hidden"
    >
      <div className={`relative ${getCardColor()} h-32 flex items-center justify-center backdrop-blur-sm`}>
        <div className="text-graphite-700">
          {getIcon()}
        </div>
        {item.isOriginalResearch && (
          <div className="absolute top-3 left-3 bg-delta-blue text-snow text-xs px-3 py-1 rounded-full flex items-center gap-1 font-semibold shadow-lg font-sans">
            <Sparkles className="w-3 h-3" />
            Original Research
          </div>
        )}
        <div className="absolute top-3 right-3 glass text-graphite-700 text-xs px-3 py-1 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {getDuration()}
        </div>
      </div>

      <div className="p-5">
        <div className="flex flex-wrap gap-2 mb-3">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="bg-mist text-graphite-700 text-xs px-3 py-1 rounded-full font-sans"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="font-display font-semibold text-graphite-900 text-lg mb-2 group-hover:text-delta-blue transition-colors duration-micro ease-snap">
          {item.title}
        </h3>

        <p className="text-silver-500 text-sm leading-relaxed mb-4 line-clamp-2 font-sans">
          {item.description}
        </p>

        <div className="flex items-center justify-between text-xs text-silver-500 font-sans">
          <span>{item.author}</span>
          <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;