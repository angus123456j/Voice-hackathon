# AI Voice Learning Engine  
## Hackathon Project Charter

---

## 1. Project Overview

This project is a modular AI voice learning system built using Smallest.ai APIs.

The system captures live speech, converts it into structured LaTeX lecture notes, generates spoken lecture playback, and enables real-time voice-based Q&A.

The goal is to build a real-time AI lecture transformation pipeline suitable for educational applications.

---

## 2. System Architecture

### Pipeline Overview

User Speech  
→ Pulse STT API  
→ Electron API (LaTeX Formatting)  
→ Lightning v3.1 TTS API (Lecture Playback)  
→ Hydra API (Voice Q&A)  
→ Frontend (React + TailwindCSS)

---

## 3. Team Roles and API Ownership

### Angus

**Responsibilities**
- Pulse STT integration
- Electron formatting pipeline
- Speech-to-LaTeX conversion
- Backend architecture setup

**APIs Owned**
- Pulse STT API
- Electron API

**Technical Scope**
- Implement real-time streaming speech-to-text
- Capture live lecture speech
- Output raw transcript
- Clean transcript and remove filler words
- Structure content into:
  - Sections
  - Bullet points
  - Definitions
  - Theorems (if applicable)
- Convert formatted output into LaTeX-ready structure

Angus owns the ingestion and structuring layer of the system.

---

### Mo

**Responsibilities**
- Lightning v3.1 TTS integration
- Hydra integration (co-owned with Kevin)

**APIs Owned**
- Lightning v3.1 TTS API
- Hydra API (shared with Kevin)

**Technical Scope**
- Convert structured LaTeX notes into spoken lecture audio
- Stream audio output
- Enable language switching if time permits
- Implement real-time speech-to-speech Q&A
- Maintain conversational context

Mo owns the output and interactive voice layer.

---

### Kevin

**Responsibilities**
- Hydra integration (co-owned with Mo)
- Session management
- Conversational stability

**APIs Owned**
- Hydra API (shared with Mo)

**Technical Scope**
- Initialize and manage Hydra sessions
- Handle conversational memory
- Improve stability for live Q&A
- Handle interruptions and edge cases

Kevin owns the conversational robustness layer.

---

### Frontend

**Stack**
- React
- TailwindCSS

**Ownership**
- Implemented by any available team member after core API integrations

**Responsibilities**
- Microphone interface
- Live transcript display
- Structured LaTeX display panel
- Audio playback controls
- Voice Q&A interface
- Clean and intuitive demo experience

Frontend development is secondary to core API integration.

---

## 4. Functional Modules

### Module 1 — Live Lecture Capture  
Owner: Angus  
API: Pulse STT  
Output: Raw transcript  

### Module 2 — Structured LaTeX Notes  
Owner: Angus  
API: Electron  
Output: Organized LaTeX lecture content  

### Module 3 — Lecture Playback  
Owner: Mo  
API: Lightning v3.1  
Output: Spoken lecture audio  

### Module 4 — Real-Time Voice Q&A  
Owners: Mo and Kevin  
API: Hydra  
Output: Conversational AI responses  

---

## 5. MVP Definition

### Required Features
- Live speech-to-text transcription
- Transcript-to-LaTeX formatting
- LaTeX-to-speech playback
- Functional voice-based Q&A
- Clean frontend interface

### Stretch Goals
- Multi-language support
- Session save functionality
- UI polish and latency optimization

---

## 6. Technical Principles

- Fully modular API architecture
- Real-time streaming where supported
- Clear separation of responsibilities
- No monolithic model dependency
- Maintain simplicity and avoid overengineering

---

## 7. Demo Flow

1. User speaks → Pulse transcribes
2. Electron structures transcript into LaTeX
3. Lightning generates spoken lecture
4. User asks a verbal question
5. Hydra responds in real time

---

## 8. Project Goal Statement

This project builds a modular AI voice learning engine powered by Smallest.ai APIs that transforms raw speech into structured knowledge and interactive audio experiences.
