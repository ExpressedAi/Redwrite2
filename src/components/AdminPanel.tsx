import React, { useState, useEffect } from 'react';
import { Upload, Plus, Edit3, Trash2, Eye, Lock, LogOut } from 'lucide-react';
import { ContentItem } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: ContentItem[];
  onContentUpdate: (newContent: ContentItem[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, content, onContentUpdate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Check if already authenticated
  useEffect(() => {
    const authStatus = localStorage.getItem('redwrite-admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'redwrite2025') {
      setIsAuthenticated(true);
      localStorage.setItem('redwrite-admin-auth', 'true');
      setPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('redwrite-admin-auth');
  };

  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const getFileType = (fileName: string): ContentItem['type'] => {
    const ext = fileName.toLowerCase().split('.').pop();
    
    if (['mp4', 'webm', 'mov', 'avi'].includes(ext || '')) return 'video';
    if (['mp3', 'wav', 'm4a', 'flac', 'ogg'].includes(ext || '')) return 'audio';
    if (['pdf'].includes(ext || '')) return 'pdf';
    if (['doc', 'docx', 'txt'].includes(ext || '')) return 'document';
    if (['html', 'htm'].includes(ext || '')) return 'article';
    
    return 'document'; // default
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadStatus(`Uploading ${file.name}...`);

      try {
        // For demo purposes, we'll simulate file upload
        // In a real app, you'd upload to your server/CDN
        const fileType = getFileType(file.name);
        
        // Generate new content item
        const newContentItem: ContentItem = {
          id: generateId(),
          title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
          description: `Uploaded ${fileType} content - ${file.name}`,
          type: fileType,
          url: `/uploads/${file.name}`, // This would be your actual upload URL
          author: 'Redwrite Admin',
          publishedAt: new Date().toISOString(),
          tags: ['Uploaded', fileType.charAt(0).toUpperCase() + fileType.slice(1)],
          readTime: fileType === 'video' || fileType === 'audio' ? 30 : 10,
          ...(fileType === 'video' || fileType === 'audio' ? { duration: 30 } : {})
        };

        // Add to content
        const updatedContent = [newContentItem, ...content];
        onContentUpdate(updatedContent);
        
        setUploadStatus(`✅ ${file.name} uploaded successfully!`);
        
        // Clear success message after 3 seconds
        setTimeout(() => setUploadStatus(''), 3000);
        
      } catch (error) {
        setUploadStatus(`❌ Failed to upload ${file.name}`);
        console.error('Upload error:', error);
      }
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const deleteContent = (id: string) => {
    if (confirm('Are you sure you want to delete this content?')) {
      const updatedContent = content.filter(item => item.id !== id);
      onContentUpdate(updatedContent);
    }
  };

  if (!isOpen) return null;

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
            <p className="text-gray-600">Enter password to access content management</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Access Admin Panel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full text-gray-500 hover:text-gray-700 py-2"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Admin Panel
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex">
      <div className="bg-white w-full max-w-6xl mx-auto m-4 rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">🔥 Redwrite Admin Panel</h2>
          <div className="flex gap-3">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Zone */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Upload New Content</h3>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-xl font-medium text-gray-700 mb-2">
                Drop files here or click to upload
              </p>
              <p className="text-gray-500 mb-4">
                Videos, Audio, PDFs, Documents, HTML Articles
              </p>
              <input
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="hidden"
                id="file-upload"
                accept=".mp4,.webm,.mov,.avi,.mp3,.wav,.m4a,.flac,.ogg,.pdf,.doc,.docx,.txt,.html,.htm"
              />
              <label
                htmlFor="file-upload"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg cursor-pointer inline-block transition-colors"
              >
                Choose Files
              </label>
            </div>
            {uploadStatus && (
              <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                <p className="text-sm font-medium">{uploadStatus}</p>
              </div>
            )}
          </div>

          {/* Content Management */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Manage Content ({content.length} items)</h3>
            <div className="grid gap-4">
              {content.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.title}</h4>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        item.type === 'video' ? 'bg-purple-100 text-purple-800' :
                        item.type === 'audio' ? 'bg-pink-100 text-pink-800' :
                        item.type === 'pdf' || item.type === 'document' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-500">{item.author}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(item.url, '_blank')}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      title="Preview"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteContent(item.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;