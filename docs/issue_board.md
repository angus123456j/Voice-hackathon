# Hackathon Issue Board
AI Voice Learning Engine

---

## Legend

- [ ] Not Started
- [~] In Progress
- [x] Completed

---

# Phase 1 — Core Backend Infrastructure

## 1. Backend Project Setup
Owner: Angus  
Status: [ ]

- [ ] Initialize FastAPI project
- [ ] Setup environment variables
- [ ] Configure API key management
- [ ] Create base routing structure
- [ ] Add basic health-check endpoint

---

## 2. Pulse STT Streaming Integration
Owner: Angus  
Status: [ ]

- [ ] Implement microphone audio streaming pipeline
- [ ] Connect to Pulse STT API
- [ ] Handle streaming transcription responses
- [ ] Return transcript to frontend in real time
- [ ] Handle disconnect/reconnect edge cases

Deliverable: Real-time transcript visible on frontend

---

## 3. Electron LaTeX Formatting Pipeline
Owner: Angus  
Status: [ ]

- [ ] Design structured lecture formatting prompt
- [ ] Remove filler words
- [ ] Convert transcript to structured format
- [ ] Convert structured output to LaTeX-ready format
- [ ] Validate LaTeX formatting consistency

Deliverable: Clean LaTeX lecture output from transcript

---

# Phase 2 — Voice Output Layer

## 4. Lightning v3.1 TTS Integration
Owner: Mo  
Status: [ ]

- [ ] Connect to Lightning v3.1 API
- [ ] Convert LaTeX content to readable text
- [ ] Generate spoken lecture audio
- [ ] Stream audio playback to frontend
- [ ] Test latency and audio quality

Deliverable: AI-generated lecture playback

---

# Phase 3 — Conversational Layer

## 5. Hydra Voice Q&A Integration
Owners: Mo + Kevin  
Status: [ ]

- [ ] Initialize Hydra session
- [ ] Implement speech-to-speech interaction
- [ ] Maintain session memory
- [ ] Enable questions about lecture content
- [ ] Handle interruption or overlapping speech
- [ ] Test conversation stability

Deliverable: Real-time voice-based Q&A

---

# Phase 4 — Frontend

## 6. Frontend Setup
Owner: Open  
Status: [ ]

- [ ] Initialize React project
- [ ] Setup TailwindCSS
- [ ] Create layout structure
- [ ] Implement state management

---

## 7. Live Transcript UI
Owner: Open  
Status: [ ]

- [ ] Microphone start/stop button
- [ ] Real-time transcript display
- [ ] Loading indicators
- [ ] Error state handling

---

## 8. Structured Notes Panel
Owner: Open  
Status: [ ]

- [ ] Display formatted LaTeX
- [ ] Render LaTeX properly
- [ ] Scrollable content area

---

## 9. Audio Playback Controls
Owner: Open  
Status: [ ]

- [ ] Play button
- [ ] Stop button
- [ ] Loading state
- [ ] Audio buffering handling

---

## 10. Voice Q&A Interface
Owner: Open  
Status: [ ]

- [ ] Q&A microphone mode
- [ ] Display conversational transcript
- [ ] Response playback handling

---

# Phase 5 — Final Integration & Testing

## 11. End-to-End Pipeline Test
Owner: All  
Status: [ ]

- [ ] Speech → Transcript → LaTeX → Audio
- [ ] Voice Q&A functional
- [ ] Frontend stable
- [ ] No breaking errors

---

## 12. Latency Optimization
Owner: All  
Status: [ ]

- [ ] Measure STT latency
- [ ] Measure Electron processing time
- [ ] Measure TTS latency
- [ ] Optimize where possible

---

## 13. Demo Preparation
Owner: All  
Status: [ ]

- [ ] Prepare demo script
- [ ] Prepare fallback plan
- [ ] Test WiFi robustness
- [ ] Prepare backup recording
- [ ] Clean UI polish

---

# MVP Definition

Minimum viable demo must include:

- Live speech-to-text transcription
- Transcript formatted into LaTeX
- AI lecture playback
- Real-time voice Q&A
- Clean working UI
