# Product Charter
## ProfReplay AI (MVP)

---

## 1. Vision

ProfReplay AI transforms a recorded lecture into an interactive AI tutor trained specifically on that lecture.

Instead of replaying a static recording, students receive:

- A structured LaTeX-backed knowledge document
- An AI tutor grounded strictly in that lecture
- Professor-voiced narration (via ElevenLabs cloning)
- Slide-synchronized teaching
- Real-time interactive questioning

This is a reconstructive AI teaching system, not a transcription tool.

---

## 2. Problem Statement

Students:

- Miss clarifications asked during lectures
- Struggle to re-follow complex explanations
- Cannot interact with recorded lectures
- Cannot synchronize slides with explanations
- Cannot ask follow-up questions to recordings

Current lecture recordings are passive and cognitively inefficient.

ProfReplay AI turns a lecture into an interactive, contextual tutor experience.

---

## 3. MVP Scope

The MVP includes:

1. MP3 lecture upload
2. Transcript generation using Smallest.ai Pulse and Lightning
3. Conversion of transcript into structured LaTeX knowledge
4. Slide deck upload (PDF/PPT)
5. AI tutor initialized using lecture-derived context
6. Voice narration using ElevenLabs professor voice clone
7. Automatic slide navigation during tutor explanation
8. User interruption and conversational questioning
9. Tutor-controlled slide navigation when answering questions

Stretch Goal:
Optional 3Blue1Brown-style animated explanation for selected equations.

---

## 4. Technical Architecture

### Frontend

- Next.js (React)
- Tailwind CSS
- PDF.js for slide rendering
- KaTeX for LaTeX rendering
- WebSocket client for real-time interaction
- Streaming audio playback

### Backend

- Node.js
- Express
- WebSocket server

Core Services:

- Audio Processing Service
- Lecture Structuring Service
- Tutor Agent Service
- Slide Navigation Controller
- ElevenLabs Voice Adapter

### External APIs

- Smallest.ai Pulse (Speech-to-Text)
- Smallest.ai lightning (Voice Cloning + TTS)
- LLM (GPT-4o / Claude / Gemini for structuring + reasoning)

Optional Stretch:
- Python microservice for Manim animation rendering

---

## 5. System Flow

### Step 1: Upload

User uploads:
- MP3 lecture
- Slide deck (PDF/PPT)

Backend sends MP3 to Smallest Pulse and receives transcript.

### Step 2: Structuring

LLM converts transcript into structured JSON knowledge document:

- Sections
- Concepts
- Equations (LaTeX)
- Student questions
- Clarifications
- Summary

This becomes the Tutor Context Document (TCD).

### Step 3: Tutor Initialization

Tutor is grounded strictly in:

- TCD
- Extracted slide text
- Current slide index

Tutor is not allowed to use external knowledge beyond provided lecture context.

### Step 4: Slide Processing

Slides are:

- Converted to image frames
- Indexed by slide number
- Text extracted for keyword matching

### Step 5: Narration

Tutor generates structured response:

{
  "speech": "...",
  "navigate_to_slide": 7
}

Speech is sent to ElevenLabs for streaming playback.
If navigation instruction exists, slides auto-advance.

### Step 6: Interactive Mode

User interrupts.

- Audio stops
- User speech transcribed
- Question sent to Tutor Agent with:
  - TCD
  - Current slide index
  - Conversation memory

Tutor may:

- Answer verbally
- Navigate to relevant slide
- Reference equations

---

## 6. User Stories

### Lecture Upload

As a student,
I want to upload a lecture recording,
so that I can turn it into an interactive tutor.

Acceptance Criteria:
- MP3 processed successfully
- Structured LaTeX knowledge generated

### Structured Knowledge

As a STEM student,
I want equations formatted clearly,
so I can understand formulas accurately.

Acceptance Criteria:
- LaTeX renders correctly
- Student questions preserved
- Clean section structure

### Tutor Playback

As a student reviewing material,
I want the tutor to walk through the lecture in the professor’s voice,
so I can revisit concepts naturally.

Acceptance Criteria:
- Voice uses ElevenLabs clone
- Slides auto-play in sync
- Full lecture coverage

### Interactive Questioning

As a student,
I want to interrupt and ask questions,
so I can clarify confusion instantly.

Acceptance Criteria:
- User speech captured
- Tutor responds contextually
- Slide navigation adjusts if needed

---

## 7. Constraints

- No database (in-memory session storage)
- Single-user demo mode
- No authentication
- Logical slide navigation only (no timestamp syncing)
- Strict grounding in lecture context to prevent hallucination

---

## 8. Definition of Done

MVP is complete when:

- MP3 → Structured LaTeX document works
- Tutor narrates using professor voice clone
- Slides auto-navigate based on tutor output
- User can interrupt and ask questions
- Tutor answers strictly using lecture context
- LaTeX renders correctly

3Blue1Brown animation is optional and not required for MVP completion.
