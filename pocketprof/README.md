# ProfReplay AI

**Transform recorded lectures into interactive AI tutors** with professor voice cloning, slide synchronization, and real-time Q&A.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![Node.js](https://img.shields.io/badge/Node.js-20-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎯 Features

- **🎤 Audio Processing**: Upload MP3 lectures and get AI-powered transcription via **Smallest.ai Pulse** (100ms TTFB)
- **📚 Knowledge Extraction**: Automatic structuring with **Smallest.ai Electron SLM** (45ms TTFT, <3B params)
- **🗣️ Professor Voice**: **Smallest.ai Lightning** TTS with 100ms TTFB and voice cloning
- **📊 Slide Sync**: Automatic slide navigation synchronized with tutor explanations
- **💬 Interactive Q&A**: Ask questions and get contextual answers grounded in lecture content
- **🤖 OpenAI Computer Use**: Enhanced automation and slide analysis capabilities (optional)
- **☁️ Easy Deployment**: One-click deployment via runanywhere.ai
- **⚡ Ultra-Fast**: 45ms LLM responses, 100ms voice generation

## 🏗️ Architecture

### Frontend (Next.js + React + TypeScript)
- **Premium UI** with Tailwind CSS, glassmorphism, and smooth animations
- **PDF.js** for slide rendering
- **KaTeX** for LaTeX equation display
- **WebSocket** for real-time bidirectional communication

### Backend (Node.js + Express)
- **REST API** for file uploads and data retrieval
- **WebSocket Server** for real-time tutor interactions
- **Microservices Architecture**:
  - Audio Processing (**Smallest.ai Pulse** - 100ms TTFB STT)
  - Lecture Structuring (**Smallest.ai Electron** - 45ms TTFT SLM)
  - Slide Processing (PDF parsing)
  - Tutor Agent (**Smallest.ai Electron** - conversational AI)
  - Voice Generation (**Smallest.ai Lightning** - 100ms TTFB TTS)
  - Computer Use (OpenAI - optional)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- API Keys (see Configuration section)

### Installation

1. **Clone and install dependencies**:
```bash
cd c:\Users\kodxity\Documents\projects\pocketprof
npm install
cd backend && npm install && cd ..
```

2. **Configure environment variables** in `.env`:
```env
# Required - Smallest.ai (Primary AI Provider)
SMALLEST_API_KEY=your_smallest_api_key

# Optional - Individual model keys (if different from main key)
SMALLEST_PULSE_API_KEY=your_pulse_key
SMALLEST_ELECTRON_API_KEY=your_electron_key
SMALLEST_LIGHTNING_API_KEY=your_lightning_key

# Optional - OpenAI (for Computer Use only)
OPENAI_COMPUTER_USE_API_KEY=your_computer_use_key
```

3. **Run development servers**:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev
```

4. **Open browser**: Navigate to `http://localhost:3000`

Or use the convenience script:
```bash
npm run dev:all
```

## 📖 Usage

### 1. Upload Lecture
- Upload an MP3 audio file (max 200MB)
- Upload slide deck (PDF or PPT)

### 2. Processing
The system will:
- Transcribe audio using Smallest.ai Pulse
- Extract structured knowledge with LaTeX formatting
- Process slides into navigable images
- Initialize AI tutor with lecture context

### 3. Interactive Learning
- Click **"Start AI Tutor"** to begin
- Listen to professor-voiced explanations
- Watch slides auto-navigate
- Click **"Interrupt & Ask"** to ask questions
- Get contextual answers grounded in the lecture

## 🔑 API Keys Configuration

### Required

**Smallest.ai API Key** (All-in-One)
- Get from: https://smallest.ai
- Used for: Pulse (STT), Electron (LLM), Lightning (TTS)
- Single key works for all models
- Performance: 45ms TTFT (LLM), 100ms TTFB (TTS/STT)

### Optional (Enhanced Features)

**OpenAI Computer Use** (Advanced Automation)
- Get from: https://platform.openai.com/api-keys
- Used for: Slide automation, visual analysis
- Optional: System works without it

### Legacy (No Longer Used)
- ~~ElevenLabs~~ → Replaced by Smallest.ai Lightning
- ~~OpenAI GPT-4o~~ → Replaced by Smallest.ai Electron
   - Location: `AudioProcessingService.js`

## 🔌 API Integrations

### ✅ Implemented Integrations

1. **Smallest.ai Pulse** (Speech-to-Text)
   - Purpose: High-accuracy transcription with 100ms TTFB
   - Features: 38+ languages, code-switching, emotion detection
   - Fallback: Mock transcript for testing
   - Location: `AudioProcessingService.js`

2. **Smallest.ai Electron** (Small Language Model)
   - Purpose: Lecture structuring & tutor responses
   - Features: 45ms TTFT, <3B params, JSON mode, conversational AI
   - Replaces: OpenAI GPT-4o
   - Locations: `LectureStructuringService.js`, `TutorAgentService.js`

3. **Smallest.ai Lightning** (Text-to-Speech)
   - Purpose: Professor voice generation with 100ms TTFB
   - Features: Voice cloning, 30+ languages, streaming support
   - Replaces: ElevenLabs
   - Location: `VoiceService.js`

4. **OpenAI Computer Use** (Optional)
   - Purpose: Slide automation & analysis
   - Features: Vision analysis, demo automation
   - Location: `ComputerUseService.js`

## 🌐 Deployment

### Deploy to runanywhere.ai

1. **Install runanywhere CLI**:
```bash
npm install -g runanywhere
```

2. **Deploy**:
```bash
runanywhere deploy
```

The `runanywhere.config.json` file contains all deployment configuration.

### Manual Deployment

1. **Build frontend**:
```bash
npm run build
```

2. **Set environment variables** on your hosting platform

3. **Start servers**:
```bash
# Start backend
cd backend && npm start

# Start frontend (production)
npm start
```

## 📁 Project Structure

```
pocketprof/
├── app/                          # Next.js app directory
│   ├── page.tsx                  # Main application page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── UploadSection.tsx         # File upload interface
│   ├── SlideViewer.tsx           # Slide display & navigation
│   ├── KnowledgeDocument.tsx     # Structured notes display
│   ├── AudioPlayer.tsx           # Voice playback controls
│   └── ChatInterface.tsx         # Q&A interface
├── hooks/                        # Custom React hooks
│   └── useWebSocket.ts           # WebSocket client
├── lib/                          # Utilities
│   └── api.ts                    # API client
├── backend/                      # Node.js backend
│   ├── server.js                 # Express server
│   ├── services/                 # Business logic
│   │   ├── AudioProcessingService.js
│   │   ├── LectureStructuringService.js
│   │   ├── SlideProcessingService.js
│   │   ├── TutorAgentService.js
│   │   ├── VoiceService.js
│   │   └── ComputerUseService.js
│   ├── websocket/                # WebSocket handlers
│   │   └── handlers.js
│   └── utils/                    # Utilities
│       └── sessionManager.js     # In-memory storage
├── .env                          # Environment variables
├── package.json                  # Frontend dependencies
└── runanywhere.config.json       # Deployment config
```

## 🎨 Design Philosophy

The UI follows modern web design principles:
- **Glassmorphism** effects for depth
- **Gradient animations** for visual interest
- **Smooth transitions** for professional feel
- **Premium color palette** (blues, purples, no generic colors)
- **Responsive layout** for all screen sizes
- **Dark mode** optimized

## 🔧 Advanced Features

### OpenAI Computer Use
Enable automated slide navigation and visual analysis:
```env
OPENAI_COMPUTER_USE_API_KEY=your_key
```

Features:
- Automated demo walkthroughs
- Vision-based slide analysis
- Smart slide navigation

### Strict Grounding
The AI tutor is configured to:
- Answer only from lecture content
- Prevent hallucination
- Reference specific slides
- Maintain conversation context

## 🐛 Troubleshooting

**WebSocket connection fails**:
- Ensure backend is running on port 3001
- Check firewall settings

**API calls fail**:
- Verify API keys in `.env`
- Check API key validity and quotas

**Slides don't display**:
- Ensure PDF file is valid
- Check browser console for errors

**No audio playback**:
- Verify ElevenLabs API key
- Check browser audio permissions

## 📝 Development

**Run tests**:
```bash
npm test
```

**Lint code**:
```bash
npm run lint
```

**Build for production**:
```bash
npm run build
```

## 🤝 Contributing

This is an MVP project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Smallest.ai** for speech-to-text
- **ElevenLabs** for voice cloning
- **OpenAI** for LLM and Computer Use
- **Next.js** and **React** teams

---

**Built with ❤️ for better learning experiences**
