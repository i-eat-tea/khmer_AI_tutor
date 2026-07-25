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

## Speech (ASR + TTS)

Both `server/services/asr.js` and `server/services/tts.js` use **Google
Cloud Speech-to-Text / Text-to-Speech**, since both support Khmer
(`km-KH`) and don't require a Chinese phone number to sign up (unlike
ByteDance's Volcengine platform, which was ruled out for that reason).

Auth for local development uses your own Google login, no key file
needed:

```bash
gcloud auth application-default login
```

If you later deploy this to a real server (not your own laptop), switch
to a service account instead — see Google's docs on Application Default
Credentials for the production setup.

## Running it

```bash
cd server
cp .env.example .env    # then fill in your OPENAI_API_KEY
npm install
gcloud auth application-default login   # one-time, for Google Cloud auth
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
