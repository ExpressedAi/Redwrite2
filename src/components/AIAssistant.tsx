import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ContentItem } from '../types';
import { MessageCircle, Send, X, Bot, User, Sparkles, Database, Video, Headphones, FileText, File, BookOpen } from 'lucide-react';
import { OpenRouterService } from '../services/openRouterService';

interface AIAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectContent: (item: ContentItem) => void;
  content: ContentItem[];
}

// ✨ BULLETPROOF MARKDOWN PARSER - NO ASTERISKS OR BLOCKQUOTES SURVIVE! ✨
const parseMarkdown = (text: string): string => {
  let html = text;
  
  // 1. PROTECT CODE BLOCKS FIRST (prevent markdown inside code)
  const codeBlocks: string[] = [];
  html = html.replace(/```([\s\S]*?)```/g, (match, content) => {
    codeBlocks.push(match);
    return `__CODE_BLOCK_${codeBlocks.length - 1}__`;
  });
  
  // 2. HEADERS - Clean and Beautiful
  html = html.replace(/^### (.+$)/gm, '<h3 class="text-lg font-bold text-gray-900 mb-2 mt-4">$1</h3>');
  html = html.replace(/^## (.+$)/gm, '<h2 class="text-xl font-bold text-gray-900 mb-3 mt-4">$1</h2>');
  html = html.replace(/^# (.+$)/gm, '<h1 class="text-2xl font-bold text-gray-900 mb-4 mt-4">$1</h1>');
  
  // 3. BLOCKQUOTES - Process markdown inside blockquotes too
  // Match blockquotes with content: > content
  html = html.replace(/^> (.+$)/gm, (match, content) => {
    // Process markdown inside the blockquote content first
    let processedContent = content;
    
    // Process bold and italic within blockquote
    processedContent = processedContent.replace(/\*\*\*(.+?)\*\*\*/g, '<strong class="font-bold text-gray-900"><em class="italic">$1</em></strong>');
    processedContent = processedContent.replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
    processedContent = processedContent.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em class="italic text-gray-800">$1</em>');
    
    return `<div class="border-l-4 border-blue-400 bg-blue-50 pl-4 py-3 my-3 rounded-r-lg"><div class="text-blue-900 font-medium">${processedContent}</div></div>`;
  });
  
  // 4. BOLD TEXT - **text** -> <strong>
  // CRITICAL: Process from longest to shortest to avoid conflicts
  // Match ***text*** (bold + italic) - must have content between
  html = html.replace(/\*\*\*([^*\n]+?)\*\*\*/g, '<strong class="font-bold text-gray-900"><em class="italic">$1</em></strong>');
  // Match **text** (bold) - must have content between
  html = html.replace(/\*\*([^*\n]+?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
  
  // 5. ITALIC TEXT - *text* -> <em>
  // Match single asterisks that aren't part of bold (must have content)
  html = html.replace(/(?<!\*)\*([^*\n]+?)\*(?!\*)/g, '<em class="italic text-gray-800">$1</em>');
  
  // 6. INLINE CODE - `text` -> <code>
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">$1</code>');
  
  // 7. LISTS - Clean bullet points
  html = html.replace(/^[\*\-\+] (.+$)/gm, '<li class="ml-4 mb-1 text-gray-800">• $1</li>');
  
  // 8. NUMBERED LISTS
  html = html.replace(/^\d+\. (.+$)/gm, '<li class="ml-4 mb-1 text-gray-800">$1</li>');
  
  // 9. LINKS - [text](url) -> <a>
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline font-medium">$1</a>');
  
  // 10. RESTORE CODE BLOCKS
  codeBlocks.forEach((block, index) => {
    const content = block.replace(/```(.*?)\n?([\s\S]*?)```/g, '$2');
    html = html.replace(`__CODE_BLOCK_${index}__`, 
      `<pre class="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto my-3"><code>${content.trim()}</code></pre>`
    );
  });
  
  // 11. AGGRESSIVE CLEANUP OF UNMATCHED MARKDOWN CHARACTERS (BEFORE LINE BREAK CONVERSION)
  // Remove standalone blockquote markers (>) that weren't part of valid blockquotes
  // This must happen BEFORE converting \n to <br> so we can match line boundaries
  html = html.replace(/^>\s*$/gm, ''); // > alone on a line
  html = html.replace(/^>\s+\n/gm, '\n'); // > at start of line followed by whitespace and newline
  html = html.replace(/\n\s*>\s*\n/g, '\n\n'); // > between newlines
  
  // Remove standalone markdown asterisks that didn't form valid markdown
  // Pattern: *** with no content (standalone or at line boundaries)
  html = html.replace(/^\s*\*\*\*\s*$/gm, ''); // *** alone on a line
  html = html.replace(/\*\*\*(?!\S)/g, ''); // *** at end of content (no non-whitespace after)
  html = html.replace(/(?<!\S)\*\*\*/g, ''); // *** at start of content (no non-whitespace before)
  html = html.replace(/\n\s*\*\*\*\s*\n/g, '\n\n'); // *** between newlines
  
  // Pattern: ** with no content (standalone or at line boundaries)
  html = html.replace(/^\s*\*\*\s*$/gm, ''); // ** alone on a line
  html = html.replace(/\*\*(?!\S)/g, ''); // ** at end of content (no non-whitespace after)
  html = html.replace(/(?<!\S)\*\*/g, ''); // ** at start of content (no non-whitespace before)
  html = html.replace(/\n\s*\*\*\s*\n/g, '\n\n'); // ** between newlines
  
  // Pattern: standalone * at word boundaries
  html = html.replace(/^\s*\*\s*$/gm, ''); // * alone on a line
  html = html.replace(/(?<!\S)\*(?!\S)/g, ''); // standalone * at word boundaries
  html = html.replace(/\n\s*\*\s*\n/g, '\n\n'); // * between newlines
  
  // Final pass: Remove any remaining orphaned asterisks (before line break conversion)
  // Only remove if they're clearly not part of valid markdown and not part of HTML tags
  // Be careful not to remove asterisks that are part of HTML attributes or content
  // This pattern removes ** that's not part of *** and not inside HTML tags
  html = html.replace(/(?<!<[^>]*?)(?<![*])\*\*(?![*])(?![^<]*>)/g, ''); // ** not part of *** and not in HTML
  html = html.replace(/(?<!<[^>]*?)(?<![*])\*(?![*])(?![^<]*>)/g, ''); // * not part of ** or *** and not in HTML
  
  // Final pass: Remove any remaining standalone > characters (before line break conversion)
  // Only remove > that are clearly not part of HTML tags
  // Pattern: > that's not preceded by < (opening tag) and not followed by word character
  html = html.replace(/(?<!<[^>]*?)>(?!\w)/g, ''); // > not part of HTML tag, but preserve those in tags
  
  // 12. LINE BREAKS - Convert \n to <br> but preserve paragraphs
  html = html.replace(/\n\n/g, '</p><p class="mb-3">');
  html = html.replace(/\n/g, '<br>');
  
  // 13. FINAL CLEANUP PASS (after line break conversion)
  // Catch any leftover markdown characters that slipped through
  // Remove standalone > that appear between <br> tags or at start/end
  html = html.replace(/<br>\s*>\s*<br>/gi, '<br><br>'); // > between <br> tags
  html = html.replace(/^>\s*<br>/gi, '<br>'); // > at start followed by <br>
  html = html.replace(/<br>\s*>\s*$/gi, '<br>'); // > at end after <br>
  html = html.replace(/>\s*<br>/gi, '<br>'); // > followed by <br> anywhere
  
  // Remove standalone ** that appear between <br> tags
  html = html.replace(/<br>\s*\*\*\s*<br>/gi, '<br><br>'); // ** between <br> tags
  html = html.replace(/^\s*\*\*\s*<br>/gi, '<br>'); // ** at start followed by <br>
  html = html.replace(/<br>\s*\*\*\s*$/gi, '<br>'); // ** at end after <br>
  html = html.replace(/\*\*\s*<br>/gi, '<br>'); // ** followed by <br> anywhere
  
  // Remove standalone * that appear between <br> tags
  html = html.replace(/<br>\s*\*\s*<br>/gi, '<br><br>'); // * between <br> tags
  html = html.replace(/^\s*\*\s*<br>/gi, '<br>'); // * at start followed by <br>
  html = html.replace(/<br>\s*\*\s*$/gi, '<br>'); // * at end after <br>
  
  // Remove any remaining standalone > not part of HTML tags
  // This is a safe pattern that won't touch HTML tags
  html = html.replace(/(?<!<[^>]*?)>(?![a-zA-Z])/g, ''); // > not part of HTML tag, and not followed by letter
  
  // Remove any remaining standalone ** or * not part of HTML
  html = html.replace(/(?<!<[^>]*?)(?<![*])\*\*(?![*])(?![^<]*>)/g, ''); // ** not in HTML
  html = html.replace(/(?<!<[^>]*?)(?<![*])\*(?![*])(?![^<]*>)/g, ''); // * not in HTML
  
  // 14. WRAP IN PARAGRAPH
  if (!html.includes('<h1>') && !html.includes('<h2>') && !html.includes('<div class="border-l-4')) {
    html = `<p class="mb-3">${html}</p>`;
  }
  
  return html;
};

// Custom component to render content with bolt:// links
const MessageContent: React.FC<{
  content: string;
  contentItems: ContentItem[];
  onSelectContent: (item: ContentItem) => void;
}> = ({ content, contentItems, onSelectContent }) => {
  
  const getContentTypeStyle = (type: string) => {
    switch (type) {
      case 'video':
        return {
          bg: 'bg-gradient-to-r from-purple-100 to-purple-200 hover:from-purple-200 hover:to-purple-300 border-purple-300',
          icon: <Video className="w-4 h-4" />,
          text: 'Open Video'
        };
      case 'audio':
        return {
          bg: 'bg-gradient-to-r from-pink-100 to-pink-200 hover:from-pink-200 hover:to-pink-300 border-pink-300',
          icon: <Headphones className="w-4 h-4" />,
          text: 'Open Audio'
        };
      case 'pdf':
        return {
          bg: 'bg-gradient-to-r from-blue-100 to-blue-200 hover:from-blue-200 hover:to-blue-300 border-blue-300',
          icon: <FileText className="w-4 h-4" />,
          text: 'Open PDF'
        };
      case 'document':
        return {
          bg: 'bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 border-green-300',
          icon: <File className="w-4 h-4" />,
          text: 'Open Document'
        };
      default: // article
        return {
          bg: 'bg-gradient-to-r from-yellow-100 to-yellow-200 hover:from-yellow-200 hover:to-yellow-300 border-yellow-300',
          icon: <BookOpen className="w-4 h-4" />,
          text: 'Open Article'
        };
    }
  };

  // Parse content and replace bolt:// links with interactive buttons
  const renderContentWithButtons = () => {
    const parts = [];
    let lastIndex = 0;
    
    // Find all markdown links with bolt:// protocol
    const linkRegex = /\[([^\]]+)\]\(bolt:\/\/content\/([^)]+)\)/g;
    let match;
    
    while ((match = linkRegex.exec(content)) !== null) {
      const [fullMatch, linkText, contentId] = match;
      const matchStart = match.index;
      
      // Add text before the link (with markdown parsing)
      if (matchStart > lastIndex) {
        const beforeText = content.slice(lastIndex, matchStart);
        parts.push(
          <div 
            key={`text-${lastIndex}`} 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(beforeText) }}
          />
        );
      }
      
      // Find the corresponding content item
      const contentItem = contentItems.find(item => item.id === contentId);
      
      if (contentItem) {
        const style = getContentTypeStyle(contentItem.type);
        
        parts.push(
          <div key={`button-wrapper-${contentId}-${matchStart}`} className="my-3">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelectContent(contentItem);
              }}
              className={`inline-flex items-center gap-3 px-4 py-3 rounded-xl ${style.bg} border-2 ${style.bg.includes('border-') ? '' : 'border-gray-200'} text-gray-800 font-semibold cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg transform text-sm group`}
            >
              <div className="p-1 bg-white/50 rounded-lg">
                {style.icon}
              </div>
              <div className="flex flex-col items-start">
                <span className="text-sm font-bold">{linkText.includes('Open') ? linkText : style.text}</span>
                <span className="text-xs text-gray-600 group-hover:text-gray-700">{contentItem.type.charAt(0).toUpperCase() + contentItem.type.slice(1)} • {contentItem.author}</span>
              </div>
            </button>
          </div>
        );
      } else {
        // Fallback for missing content
        parts.push(
          <div key={`missing-${contentId}`} className="my-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-600 text-sm font-medium">⚠️ Content not found: {linkText}</span>
          </div>
        );
      }
      
      lastIndex = matchStart + fullMatch.length;
    }
    
    // Add remaining text (with markdown parsing)
    if (lastIndex < content.length) {
      const remainingText = content.slice(lastIndex);
      parts.push(
        <div 
          key={`text-${lastIndex}`} 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(remainingText) }}
        />
      );
    }
    
    // If no bolt:// links found, parse the entire content
    if (parts.length === 0) {
      parts.push(
        <div 
          key="full-content" 
          className="prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
        />
      );
    }
    
    return parts;
  };

  return (
    <div className="text-gray-800 leading-relaxed">
      {renderContentWithButtons()}
    </div>
  );
};

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onToggle, onSelectContent, content }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m **Red**, your Redwrite assistant. I can help you find and navigate through content. What are you looking for today?',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Add tool call message immediately
    const toolCallMessage: ChatMessage = {
      id: (Date.now() + 0.5).toString(),
      role: 'assistant',
      content: '🔍 Searching knowledge base...',
      timestamp: new Date(),
      type: 'tool_call'
    };
    
    setMessages(prev => [...prev, toolCallMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const contentContext = content.map(item => {
        const durationInfo = item.type === 'video' || item.type === 'audio' 
          ? `Duration: ${item.duration}m` 
          : `Read time: ${item.readTime}m`;
        
        return `ID: ${item.id}
Title: ${item.title}
Type: ${item.type}
Author: ${item.author}
Published: ${item.publishedAt}
Description: ${item.description}
Tags: ${item.tags.join(', ')}
${durationInfo}
---`;
      }).join('\n');

      const response = await OpenRouterService.sendMessage(inputMessage, contentContext);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        type: 'text'
      };

      // Remove tool call message and add actual response
      setMessages(prev => prev.filter(msg => msg.type !== 'tool_call').concat(assistantMessage));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment. 🔄',
        timestamp: new Date(),
        type: 'text'
      };
      // Remove tool call message and add error response
      setMessages(prev => prev.filter(msg => msg.type !== 'tool_call').concat(errorMessage));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white p-4 rounded-full shadow-xl transition-all duration-300 z-50 group hover:scale-110"
      >
        <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col border border-gray-100 overflow-hidden">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Red</h3>
              <p className="text-sm text-gray-600">Content Navigator & Assistant</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-gray-50/30 to-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  {message.type === 'tool_call' ? (
                    <Database className="w-5 h-5 text-white animate-pulse" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
              )}
              
              <div
                className={`px-5 py-4 rounded-2xl max-w-2xl shadow-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                    : message.type === 'tool_call'
                    ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-gray-700 border border-yellow-200'
                    : 'bg-white text-gray-800 border border-gray-200 shadow-md'
                }`}
              >
                {message.type === 'tool_call' ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 animate-spin text-orange-500" />
                    <span className="text-sm font-medium">{message.content}</span>
                  </div>
                ) : (
                  <div>
                    {message.role === 'assistant' ? (
                      <MessageContent
                        content={message.content}
                        contentItems={content}
                        onSelectContent={onSelectContent}
                      />
                    ) : (
                      <p className="leading-relaxed font-medium">{message.content}</p>
                    )}
                  </div>
                )}
              </div>
              
              {message.role === 'user' && (
                <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Enhanced Input */}
        <div className="p-6 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about content..."
              className="flex-1 px-5 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm text-gray-800 placeholder-gray-500 font-medium"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-4 rounded-xl transition-all duration-300 font-semibold shadow-md hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send • Powered by Gemini 2.5 Flash</p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;