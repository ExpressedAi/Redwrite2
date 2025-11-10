#!/usr/bin/env node

/**
 * 🔥 REDWRITE MEDIA UPLOAD UTILITY 🔥
 * 
 * Drop any media file and automatically generate content entries!
 * 
 * Usage:
 *   node upload-media.js path/to/your-video.mp4 "Amazing AI Demo" "Jake Hallett"
 *   node upload-media.js path/to/podcast.mp3 "Deep Dive Episode" "Redwrite Podcast"  
 *   node upload-media.js path/to/guide.pdf "Technical Guide" "Research Team"
 */

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Media type detection
const getMediaType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  
  if (['.mp4', '.webm', '.mov', '.avi'].includes(ext)) return 'video';
  if (['.mp3', '.wav', '.m4a', '.flac', '.ogg'].includes(ext)) return 'audio';
  if (['.pdf'].includes(ext)) return 'pdf';
  if (['.doc', '.docx', '.txt'].includes(ext)) return 'document';
  
  throw new Error(`Unsupported file type: ${ext}`);
};

// Get destination directory based on type
const getDestinationDir = (type) => {
  const dirs = {
    'video': 'public/videos',
    'audio': 'public/audio', 
    'pdf': 'public/documents',
    'document': 'public/documents'
  };
  return dirs[type];
};

// Generate content entry
const generateContentEntry = (fileName, type, title, author, tags = []) => {
  const typeUrls = {
    'video': `/videos/${fileName}`,
    'audio': `/audio/${fileName}`,
    'pdf': `/documents/${fileName}`,
    'document': `/documents/${fileName}`
  };

  const entry = {
    id: uuidv4().substring(0, 8),
    title,
    description: `${title} - A comprehensive ${type} covering cutting-edge AI concepts and practical applications.`,
    type,
    url: typeUrls[type],
    author,
    publishedAt: new Date().toISOString(),
    tags: tags.length > 0 ? tags : ['AI', 'Technology', 'Innovation'],
    readTime: type === 'video' || type === 'audio' ? 30 : 15
  };

  if (type === 'video' || type === 'audio') {
    entry.duration = 30; // Default, user can adjust
  }

  if (type === 'video') {
    entry.thumbnail = `/images/video-thumbnails/${path.parse(fileName).name}.jpg`;
  }

  return entry;
};

// Main upload function
const uploadMedia = async (filePath, title, author, tagsStr = '') => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const fileName = path.basename(filePath);
    const type = getMediaType(filePath);
    const tags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
    
    // Create destination directory if it doesn't exist
    const destDir = getDestinationDir(type);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Copy file to destination
    const destPath = path.join(destDir, fileName);
    fs.copyFileSync(filePath, destPath);
    
    // Generate content entry
    const contentEntry = generateContentEntry(fileName, type, title, author, tags);
    
    // Read current content file
    const contentFilePath = 'src/data/sampleContent.ts';
    let contentFile = fs.readFileSync(contentFilePath, 'utf8');
    
    // Extract the array content
    const arrayStart = contentFile.indexOf('[');
    const arrayEnd = contentFile.lastIndexOf('];');
    const currentArray = contentFile.substring(arrayStart + 1, arrayEnd).trim();
    
    // Add new entry
    const newEntry = `  {
    id: '${contentEntry.id}',
    title: '${contentEntry.title}',
    description: '${contentEntry.description}',
    type: '${contentEntry.type}',
    url: '${contentEntry.url}',${contentEntry.thumbnail ? `\n    thumbnail: '${contentEntry.thumbnail}',` : ''}
    author: '${contentEntry.author}',
    publishedAt: '${contentEntry.publishedAt}',
    tags: ${JSON.stringify(contentEntry.tags)},${contentEntry.duration ? `\n    duration: ${contentEntry.duration},` : ''}
    readTime: ${contentEntry.readTime}
  }`;
    
    // Rebuild the file
    const updatedContent = `import { ContentItem } from '../types';

export const sampleContent: ContentItem[] = [
${currentArray ? currentArray + ',' : ''}
${newEntry}
];
`;
    
    // Write back to file
    fs.writeFileSync(contentFilePath, updatedContent);
    
    console.log('🎉 SUCCESS! Media uploaded and content entry created:');
    console.log(`📁 File: ${destPath}`);
    console.log(`🆔 ID: ${contentEntry.id}`);
    console.log(`📝 Title: ${contentEntry.title}`);
    console.log(`👤 Author: ${contentEntry.author}`);
    console.log(`🏷️  Tags: ${contentEntry.tags.join(', ')}`);
    console.log('\n🚀 Your content is now live in the blog!');
    
  } catch (error) {
    console.error('❌ Upload failed:', error.message);
    process.exit(1);
  }
};

// CLI interface
if (require.main === module) {
  const [,, filePath, title, author, tags] = process.argv;
  
  if (!filePath || !title || !author) {
    console.log(`
🔥 REDWRITE MEDIA UPLOADER 🔥

Usage:
  node upload-media.js <file-path> <title> <author> [tags]

Examples:
  node upload-media.js ~/Desktop/demo.mp4 "AI Fine-Tuning Demo" "Jake Hallett" "AI,Demo,Tutorial"
  node upload-media.js ~/Music/podcast.mp3 "Deep Dive Episode" "Redwrite Podcast" "Podcast,AI,Innovation"
  node upload-media.js ~/Documents/guide.pdf "Technical Guide" "Research Team" "Guide,Technical,Reference"

Supported formats:
  📹 Video: .mp4, .webm, .mov, .avi
  🎵 Audio: .mp3, .wav, .m4a, .flac, .ogg  
  📄 Documents: .pdf, .doc, .docx, .txt
    `);
    process.exit(1);
  }
  
  uploadMedia(filePath, title, author, tags);
}

module.exports = { uploadMedia };