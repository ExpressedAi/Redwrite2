export interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'pdf' | 'document';
  category: 'Applications' | 'Articles' | 'Research' | 'Trade Secrets' | 'Writing';
  url: string;
  thumbnail?: string;
  author: string;
  publishedAt: string;
  tags: string[];
  readTime?: number;
  duration?: number;
  isOriginalResearch?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'tool_call';
}

export interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectContent: (item: ContentItem) => void;
  content: ContentItem[];
}