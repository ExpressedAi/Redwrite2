import React from 'react';
import { ContentItem } from '../types';
import { X, ExternalLink, Download, Clock, Calendar, User, Share2, Bookmark } from 'lucide-react';

interface ContentViewerProps {
  item: ContentItem | null;
  onClose: () => void;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ item, onClose }) => {
  if (!item) return null;

  const renderContent = () => {
    switch (item.type) {
      case 'video':
        return (
          <div className="space-y-6">
            <div className="aspect-video bg-graphite-900 rounded-xl overflow-hidden shadow-lg">
              <video
                src={item.url}
                controls
                className="w-full h-full object-cover"
                poster={item.thumbnail}
                preload="metadata"
              >
                <p className="text-snow p-4 font-sans">
                  Your browser doesn't support HTML5 video.
                  <a href={item.url} className="text-delta-blue underline ml-1">
                    Download the video
                  </a>
                </p>
              </video>
            </div>
            <div className="prose max-w-none">
              <p className="text-graphite-700 leading-relaxed text-lg font-sans">
                {item.description}
              </p>
              <div className="mt-6 p-6 glass rounded-lg">
                <h3 className="font-display font-semibold text-graphite-900 mb-3">About this video</h3>
                <p className="text-graphite-700 leading-relaxed font-sans">
                  This video explores cutting-edge concepts in {item.tags[0].toLowerCase()},
                  providing insights and practical knowledge that you can apply immediately.
                  The content is designed for both beginners and advanced practitioners looking
                  to deepen their understanding.
                </p>
              </div>
            </div>
          </div>
        );
      
      case 'audio':
        return (
          <div className="space-y-6">
            <div className="glass bg-gradient-to-br from-orchid/10 to-mint/10 rounded-xl p-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 glass rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-12 h-12 bg-delta-blue/20 rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 bg-delta-blue rounded-full"></div>
                  </div>
                </div>
                <h3 className="text-xl font-display font-semibold text-graphite-900 mb-2">Now Playing</h3>
                <p className="text-graphite-700 font-sans">{item.title}</p>
              </div>

              <audio
                src={item.url}
                controls
                className="w-full h-12 rounded-lg"
                preload="metadata"
              >
                <p className="text-graphite-700 font-sans">
                  Your browser doesn't support HTML5 audio.
                  <a href={item.url} className="text-delta-blue underline ml-1">
                    Download the audio
                  </a>
                </p>
              </audio>
            </div>

            <div className="prose max-w-none">
              <p className="text-graphite-700 leading-relaxed text-lg font-sans">
                {item.description}
              </p>
              <div className="mt-6 p-6 glass rounded-lg">
                <h3 className="font-display font-semibold text-graphite-900 mb-3">Episode Notes</h3>
                <ul className="text-graphite-700 space-y-2 font-sans">
                  <li>• Deep dive into {item.tags[0].toLowerCase()} concepts</li>
                  <li>• Practical tips and strategies you can implement today</li>
                  <li>• Real-world examples and case studies</li>
                  <li>• Q&A segment addressing common challenges</li>
                </ul>
              </div>
            </div>
          </div>
        );
      
      case 'pdf':
      case 'document':
        return (
          <div className="space-y-6">
            <div className="glass bg-gradient-to-br from-delta-blue/10 to-mint/10 rounded-xl p-8 text-center">
              <h3 className="text-xl font-display font-semibold text-graphite-900 mb-3">Document Viewer</h3>
              <p className="text-graphite-700 mb-6 max-w-md mx-auto font-sans">
                {item.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary px-6 py-3 flex items-center gap-2 justify-center font-sans font-medium"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open Document
                </a>
                <a
                  href={item.url}
                  download
                  className="bg-graphite-700 hover:bg-graphite-900 text-snow px-6 py-3 rounded-lg flex items-center gap-2 justify-center transition-all duration-micro ease-snap font-sans font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </a>
              </div>
            </div>

            <div className="prose max-w-none">
              <div className="p-6 glass rounded-lg">
                <h3 className="font-display font-semibold text-graphite-900 mb-3">Document Overview</h3>
                <p className="text-graphite-700 leading-relaxed mb-4 font-sans">
                  This comprehensive {item.type} covers essential aspects of {item.tags[0].toLowerCase()},
                  providing detailed analysis and actionable insights. The document is structured to be
                  both informative and practical, making complex concepts accessible.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-graphite-700 font-sans">
                  <div>
                    <strong>Key Topics:</strong>
                    <ul className="mt-1 space-y-1">
                      {item.tags.map(tag => (
                        <li key={tag}>• {tag}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Estimated Reading Time:</strong>
                    <p className="mt-1">{item.readTime} minutes</p>
                    <strong className="block mt-2">Format:</strong>
                    <p className="mt-1 uppercase">{item.type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      default: // Article case - this is where the magic happens!
        return (
          <div className="space-y-6">
            <article className="prose prose-lg max-w-none">
              <div className="lead text-xl text-graphite-700 leading-relaxed mb-8 font-sans">
                {item.description}
              </div>

              {/* The Magic Button */}
              <div className="text-center mb-8">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 btn-primary font-display font-bold px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-ui ease-snap transform hover:scale-105"
                >
                  <ExternalLink className="w-5 h-5" />
                  Read Full Article with Images
                </a>
              </div>
              
              <div className="space-y-6 text-graphite-900 leading-relaxed font-sans">
                <p>
                  In today's rapidly evolving landscape, understanding the nuances of {item.tags[0].toLowerCase()}
                  has become crucial for professionals across various industries. This comprehensive exploration
                  delves deep into the fundamental concepts while providing practical insights that can be
                  immediately applied in real-world scenarios.
                </p>

                <h2 className="text-2xl font-display font-bold text-graphite-900 mt-8 mb-4">Key Concepts</h2>
                <p>
                  The foundation of {item.tags[0].toLowerCase()} rests on several core principles that have been
                  refined through years of research and practical application. These principles form the backbone
                  of modern approaches and continue to influence how we think about innovation and implementation.
                </p>

                <blockquote className="border-l-4 border-delta-blue pl-6 py-2 my-6 glass rounded-r-lg">
                  <p className="text-lg italic text-graphite-700">
                    "The future belongs to those who understand not just the 'what' but the 'why' behind
                    technological advancement. This understanding becomes the foundation for meaningful innovation."
                  </p>
                  <footer className="text-sm text-silver-500 mt-2">— {item.author}</footer>
                </blockquote>

                <h2 className="text-2xl font-display font-bold text-graphite-900 mt-8 mb-4">Practical Applications</h2>
                <p>
                  Moving beyond theory, the practical applications of these concepts reveal their true power.
                  Organizations worldwide are implementing these strategies to drive growth, improve efficiency,
                  and create sustainable competitive advantages in an increasingly complex marketplace.
                </p>

                <div className="glass bg-mint/5 rounded-lg p-6 my-6">
                  <h3 className="font-display font-semibold text-graphite-900 mb-3">Key Takeaways</h3>
                  <ul className="space-y-2 text-graphite-700">
                    <li>• Understanding fundamental principles is essential for long-term success</li>
                    <li>• Practical application requires careful consideration of context and constraints</li>
                    <li>• Continuous learning and adaptation are crucial in today's environment</li>
                    <li>• Collaboration and knowledge sharing accelerate innovation</li>
                  </ul>
                </div>

                <h2 className="text-2xl font-display font-bold text-graphite-900 mt-8 mb-4">Looking Forward</h2>
                <p>
                  As we look to the future, the importance of {item.tags[0].toLowerCase()} will only continue
                  to grow. The intersection of technology, human insight, and strategic thinking creates
                  unprecedented opportunities for those prepared to embrace change and drive innovation.
                </p>

                <p>
                  The journey ahead requires both technical competency and strategic vision. By understanding
                  these foundational concepts and their practical applications, professionals can position
                  themselves at the forefront of industry transformation.
                </p>

                {/* Another call to action at the bottom */}
                <div className="text-center mt-8 p-6 glass bg-gradient-to-r from-amber/10 to-orchid/10 rounded-xl">
                  <p className="text-graphite-900 mb-4 font-sans">
                    <strong>Want the full experience with images, charts, and enhanced formatting?</strong>
                  </p>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 btn-primary font-sans font-semibold px-6 py-3 transition-all duration-micro ease-snap"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Full Article
                  </a>
                </div>
              </div>
            </article>
          </div>
        );
    }
  };

  const getDurationText = () => {
    if (item.type === 'video' || item.type === 'audio') {
      return `${item.duration} min`;
    }
    return `${item.readTime} min read`;
  };

  return (
    <div className="fixed inset-0 bg-graphite-900/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-snow rounded-2xl max-w-5xl max-h-[90vh] overflow-y-auto w-full shadow-2xl">
        {/* Enhanced Header */}
        <div className="sticky top-0 glass border-b border-mist p-6 rounded-t-2xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium font-sans ${
                  item.type === 'video' ? 'bg-orchid/20 text-graphite-900' :
                  item.type === 'audio' ? 'bg-mint/20 text-graphite-900' :
                  item.type === 'pdf' || item.type === 'document' ? 'bg-delta-blue/20 text-graphite-900' :
                  'bg-amber/20 text-graphite-900'
                }`}>
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
                <div className="flex items-center gap-1 text-silver-500 text-sm font-sans">
                  <Clock className="w-4 h-4" />
                  {getDurationText()}
                </div>
              </div>

              <h1 className="text-3xl font-display font-bold text-graphite-900 mb-3 leading-tight">{item.title}</h1>

              <div className="flex items-center gap-4 text-sm text-graphite-700 mb-4 font-sans">
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  <span>By {item.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(item.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 text-silver-500 hover:text-graphite-900 transition-colors duration-micro ease-snap font-sans">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
                <button className="flex items-center gap-2 text-silver-500 hover:text-graphite-900 transition-colors duration-micro ease-snap font-sans">
                  <Bookmark className="w-4 h-4" />
                  <span className="text-sm">Save</span>
                </button>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-silver-500 hover:text-graphite-900 transition-colors duration-micro ease-snap p-2 hover:bg-mist rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Enhanced Content */}
        <div className="p-6 lg:p-8">
          {renderContent()}
        </div>

        {/* Enhanced Footer with Tags */}
        <div className="border-t border-mist p-6 glass rounded-b-2xl">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-sm font-display font-medium text-graphite-900 mr-2">Topics:</span>
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="bg-mist border border-cloud text-graphite-700 text-sm px-3 py-1 rounded-full hover:bg-cloud transition-all duration-micro ease-snap cursor-pointer font-sans"
              >
                #{tag.toLowerCase()}
              </span>
            ))}
          </div>

          <div className="text-xs text-silver-500 text-center font-sans">
            Published on Primitives • {new Date(item.publishedAt).getFullYear()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentViewer;