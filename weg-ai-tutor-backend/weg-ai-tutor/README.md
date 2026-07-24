# WEG AI Tutor — backend starter

This is the real backend structure for the Khmer AI home tutor, matching
the architecture described in the pitch: a secure Node/Express server
that holds all API keys, so the frontend/browser never has direct access
to any credentials.

## What's already working

- `server/services/tutor.js` — the core teaching loop (guided, step-by-step,
  never answer-dumps). This is the same logic used in the live demo
  (`weg-tutor-demo.html`), rewritten to call OpenAI directly instead of
  the in-browser API.
- `server/routes/ask.js` — ties ASR → tutor → TTS together into one endpoint.
- `server/routes/upload.js`, `dashboard.js`, `auth.js` — stubs for the
  teacher-facing features (curriculum upload, usage monitoring, login).
- `database/schema.sql` — tables for users, classes, curriculum docs, and
  a full question log for the teacher dashboard.

## What you need to plug in

Two things are placeholders because they need real API keys/accounts:

1. **`server/services/asr.js`** — speech-to-text. Use either:
   - The ByteDance ASR you already used in KIDO, or
   - Google Cloud Speech-to-Text with `languageCode: 'km-KH'`

2. **`server/services/tts.js`** — text-to-speech. Use either:
   - OpenAI TTS (you've used this before), or
   - Google Cloud Text-to-Speech (Khmer voice support)

Both files have commented-out example code showing exactly where to put
your API calls.

## Running it

```bash
cd server
cp .env.example .env    # then fill in your real API keys
npm install
npm run dev
```

Test the text-only path (no ASR/TTS needed yet) with:

```bash
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"text": "What is the area of a rectangle with length 8 and width 5?", "conversationId": "test1", "studentId": "stu_001"}'
```

## Suggested build order for the hackathon

1. Get `/api/ask` working with `text` input only (skip audio) — proves the
   tutor logic and curriculum grounding work.
2. Add TTS so replies come back as audio.
3. Add ASR so questions can be asked by voice.
4. Build the teacher dashboard frontend against `/api/dashboard` (already
   returns realistic placeholder data, so frontend work can start immediately
   without waiting on the database).
5. Wire up real database queries in `curriculum.js` and `dashboard.js`,
   replacing the TODOs.
