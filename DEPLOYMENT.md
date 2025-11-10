# 🚀 REDWRITE DEPLOYMENT GUIDE

## Netlify Deployment Instructions

### 1. Deploy to Netlify

1. **Create Netlify Account**: Go to [netlify.com](https://netlify.com) and sign up/login
2. **Connect Repository**: 
   - Click "New site from Git"
   - Connect your GitHub/GitLab repository
   - Or use drag & drop deployment by uploading the `dist` folder after building

### 2. Build Settings

**Build Command**: `pnpm build`  
**Publish Directory**: `dist`  
**Node Version**: `18` (set in Environment Variables)

### 3. Environment Variables (Optional)

None required for basic deployment - the blog works out of the box!

### 4. Manual Deployment (Fastest)

```bash
# Build the project
pnpm build

# Upload the 'dist' folder to Netlify via drag & drop
# Or use Netlify CLI:
netlify deploy --prod --dir=dist
```

## 🔐 Admin Panel Access

**URL**: `https://your-site.netlify.app` (click the Settings gear icon)  
**Password**: `redwrite2025`

## 🎬 Content Upload Workflow

1. **Access Admin Panel**: Click settings icon → enter password
2. **Upload Content**: Drag & drop any media files:
   - 📹 Videos: `.mp4`, `.webm`, `.mov`, `.avi`
   - 🎵 Audio: `.mp3`, `.wav`, `.m4a`, `.flac`, `.ogg`
   - 📄 Documents: `.pdf`, `.doc`, `.docx`, `.txt`
   - 📝 Articles: `.html` files with embedded images

3. **Instant Publication**: Content appears immediately on your live blog!

## 📁 Content Storage

- **Articles**: `/public/` (HTML files with base64 images)
- **Videos**: `/public/videos/`
- **Audio**: `/public/audio/`
- **Documents**: `/public/documents/`
- **Images**: `/public/images/`

## ⚡ Key Features

- **Password Protected Admin**: Secure content management
- **Drag & Drop Upload**: Any media type supported
- **Auto Content Generation**: Smart metadata extraction
- **Live Blog Updates**: No rebuilds required
- **Mobile Responsive**: Perfect on all devices
- **SEO Optimized**: Fast loading with proper meta tags

## 🛠 Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 🎯 Perfect For

- **Personal Blogs**: Share articles, videos, podcasts
- **Research Publications**: Academic papers with multimedia
- **Portfolio Sites**: Showcase your work across formats
- **Content Creators**: Multi-format content publishing
- **Corporate Blogs**: Professional content management

## 🔥 You're Ready to Go!

Your autonomous content management system is ready for the world. Upload, publish, and scale without limits!

**Live Demo**: Drop this on Netlify and start publishing in minutes! 🚀