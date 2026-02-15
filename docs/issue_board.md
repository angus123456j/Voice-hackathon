# PocketProf — Issue Board

---

## Legend

- [ ] Not started
- [~] In progress
- [x] Done

---

# Phase 1 — Backend core

## 1. Backend setup
Status: [x]

- [x] FastAPI project
- [x] Environment / config
- [x] Base routing
- [x] Health check (`/health`)

---

## 2. Pulse STT
Status: [x]

- [x] File upload transcription (`/pulse/transcribe`)
- [x] Live streaming WebSocket (`/pulse/live`)
- [x] Transcript returned to frontend

---

## 3. Parse (transcript → notes)
Status: [x]

- [x] Parse API (`/parse`)
- [x] Clean and structure transcript
- [x] Return formatted text (no LaTeX in main flow)

---

# Phase 2 — Voice output

## 4. Lightning TTS
Status: [x]

- [x] Lightning stream integration (`/lightning/stream`)
- [x] Text → speech for lesson and Q&A answers
- [x] Frontend playback and voice selection (e.g. Sophia, Rachel, Jordan, Arjun)
- [x] Voice sample on homepage per character

---

# Phase 3 — Slides and Q&A

## 5. Ask (slides + Q&A)
Status: [x]

- [x] Slide analysis (`/ask/analyze`)
- [x] Script alignment to slides (`/ask/align`)
- [x] Q&A endpoint (`/ask`) with context
- [x] Voice Ask flow: record → transcribe → Ask → TTS response

---

# Phase 4 — Frontend

## 6. Frontend stack
Status: [x]

- [x] React + Vite 
- [x] Custom CSS 
- [x] Single-page app with Home / Lab / Slide Player views

---

## 7. Homepage
Status: [x]

- [x] Branding (PocketProf, logo, favicon)
- [x] Hero + CTA
- [x] Character/voice picker (3D + thumbnails)
- [x] Play voice sample per character
- [x] Sponsor strip (infinite scroll)
- [x] Footer

---

## 8. Lab
Status: [x]

- [x] Section 1: Upload MP3 or record live
- [x] Results: Parse button, polished transcript, Download .txt
- [x] Result overlay after parse (transcript + download, no cut-off)
- [x] Section 2: PDF slides upload, View Slides

---

## 9. Slide Player
Status: [x]

- [x] Slides + notes view
- [x] Import notes / start TTS
- [x] Play / Pause
- [x] Ask: voice input → answer TTS
- [x] Slide sync with playback (when alignment used)


---

# MVP summary

Shipped:

- Lecture input (upload or live) → transcript.
- Parse → polished notes → download.
- PDF slides → Slide Player.
- TTS playback with voice choice and voice sample.
- Voice Ask with TTS answers.
- Clean, working UI (Home, Lab, Slide Player, result overlay).

