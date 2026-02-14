const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const multer = require('multer');


// Import services
const AudioProcessingService = require('./services/AudioProcessingService');
const LectureStructuringService = require('./services/LectureStructuringService');
const SlideProcessingService = require('./services/SlideProcessingService');
const TutorAgentService = require('./services/TutorAgentService');
const VoiceService = require('./services/VoiceService');
const ComputerUseService = require('./services/ComputerUseService');
const sessionManager = require('./utils/sessionManager');
const setupWebSocketHandlers = require('./websocket/handlers');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 200 * 1024 * 1024 }, // 200MB limit
});

// Initialize services
const audioService = new AudioProcessingService();
const structuringService = new LectureStructuringService();
const slideService = new SlideProcessingService();
const tutorService = new TutorAgentService();
const voiceService = new VoiceService();
const computerUseService = new ComputerUseService();

// API Routes

// Upload endpoint
app.post('/api/upload', upload.fields([
    { name: 'audio', maxCount: 1 },
    { name: 'slides', maxCount: 1 }
]), async (req, res) => {
    try {
        console.log('Received upload request');

        const audioFile = req.files['audio']?.[0];
        const slidesFile = req.files['slides']?.[0];

        if (!audioFile || !slidesFile) {
            return res.status(400).json({ error: 'Both audio and slides are required' });
        }

        // Process audio to transcript
        console.log('Processing audio...');
        const transcript = await audioService.processAudio(audioFile.buffer);

        // Structure the transcript into knowledge document
        console.log('Structuring knowledge...');
        const knowledge = await structuringService.structureTranscript(transcript);

        // Process slides
        console.log('Processing slides...');
        const slides = await slideService.processSlides(slidesFile.buffer, slidesFile.mimetype);

        // Store in session
        const sessionId = Date.now().toString();
        sessionManager.createSession(sessionId, {
            transcript,
            knowledge,
            slides,
            slideCount: slides.length,
        });

        res.json({
            sessionId,
            transcript,
            knowledge,
            slides: slides.map((_, index) => `/api/backend/slides/${sessionId}/${index}`),
            slideCount: slides.length,
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message || 'Failed to process upload' });
    }
});

// Get slide image
app.get('/api/slides/:sessionId/:index', (req, res) => {
    try {
        const { sessionId, index } = req.params;
        const session = sessionManager.getSession(sessionId);

        if (!session || !session.slides) {
            return res.status(404).json({ error: 'Session or slides not found' });
        }

        const slideIndex = parseInt(index);
        if (slideIndex < 0 || slideIndex >= session.slides.length) {
            return res.status(404).json({ error: 'Slide not found' });
        }

        const slideBuffer = session.slides[slideIndex];

        if (!slideBuffer) {
            console.error(`Slide buffer at index ${slideIndex} is undefined/null`);
            return res.status(404).json({ error: 'Slide buffer empty' });
        }

        // Detect content type (PDF slides are PNG, mocks are SVG)
        const sample = slideBuffer.toString('utf8', 0, 100).toLowerCase();
        const isSvg = sample.includes('<svg');

        console.log(`Serving slide ${slideIndex} (Session: ${sessionId}). Type: ${isSvg ? 'SVG' : 'PNG'}. Buffer size: ${slideBuffer.length}`);

        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.contentType(isSvg ? 'image/svg+xml' : 'image/png');
        res.send(slideBuffer);

    } catch (error) {
        console.error('Slide retrieval error:', error);
        res.status(500).json({ error: 'Failed to retrieve slide' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// WebSocket setup
setupWebSocketHandlers(wss, {
    tutorService,
    voiceService,
    computerUseService,
    sessionManager,
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ProfReplay AI Backend running on port ${PORT}`);
    console.log(`   - REST API: http://localhost:${PORT}`);
    console.log(`   - WebSocket: ws://127.0.0.1:${PORT}`);
});

module.exports = { app, server, wss };
