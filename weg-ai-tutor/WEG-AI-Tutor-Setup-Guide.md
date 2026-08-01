# WEG AI Tutor — team setup guide

This walks through everything needed to get the prototype running on your
own computer, based on what was actually done to get it working the first
time (including the errors hit along the way, so you can skip past them).

There are three parts to this project:

1. **`weg-tutor-demo.html`** — a self-contained demo (uses Claude directly,
   no setup needed). Just double-click and open in a browser. Use this for
   showing the concept quickly.
2. **The backend** (`server/` folder) — the real Node/Express server with
   the actual architecture: Gemini for tutoring logic, Google Cloud for
   Khmer speech (ASR + TTS). This needs setup (below).
3. **`weg-tutor-live.html`** — a frontend that talks to the real backend
   above, once it's running.

---

## 1. Install prerequisites

- **Node.js** — download the LTS version from [nodejs.org](https://nodejs.org).
  Check it worked: open a terminal and run `node -v`.
- **VS Code** (recommended, optional) — makes editing and running everything
  easier: [code.visualstudio.com](https://code.visualstudio.com)

---

## 2. Get the project files

Unzip the `weg-ai-tutor-backend.zip` folder anywhere on your computer.

Open a terminal and navigate into the server folder:

```bash
cd path/to/weg-ai-tutor/server
```

---

## 3. Set up Google Cloud (for Khmer speech)

This is the fiddly part. Follow these exactly.

### 3.1 Create a Google Cloud account

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Sign in with a Google account. This auto-creates a project for you
   called "My First Project" with $300 free trial credit — no need to
   create a new one manually.

### 3.2 Enable the two APIs we need

1. In the top search bar, type **"Text-to-Speech"** → click
   **Cloud Text-to-Speech API** → click **Enable**
2. Do the same for **"Speech-to-Text"** → **Cloud Speech-to-Text API** → **Enable**

### 3.3 Authenticate (no key file needed)

Google now disables downloadable service account key files by default for
new accounts, so we use a simpler method instead: your own Google login.

Install the Google Cloud CLI: [cloud.google.com/sdk/docs/install](https://cloud.google.com/sdk/docs/install)

Then in a terminal, run:

```bash
gcloud auth application-default login
```

This opens a browser — log in with the same Google account. This only
needs to be done **once per computer**.

**Known issue:** if your terminal says `gcloud: command not found`, this
usually means the terminal type (e.g. Git Bash on Windows) isn't picking
up the CLI's install location. Try switching to a PowerShell terminal
instead, or fully close and reopen VS Code so it picks up the updated
system PATH.

### 3.4 Set your quota project

Google needs to know which project to track your API usage against. Run:

```bash
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
```

Replace `YOUR_PROJECT_ID` with your actual project ID (find it at
**IAM & Admin → Settings** in the Cloud Console — it looks like
`project-xxxxxxxx-xxxx-xxxx-xxxx`).

**If `gcloud` isn't working in your terminal at all**, you can set this
manually instead:

1. Open File Explorer, paste this into the address bar: `%APPDATA%\gcloud`
2. Open `application_default_credentials.json` in a text editor
3. Add this line inside the JSON (matching your real project ID):
   ```json
   "quota_project_id": "project-xxxxxxxx-xxxx-xxxx-xxxx"
   ```
4. Save the file

---

## 4. Get a Gemini API key (the AI tutor's brain)

We use Google's **Gemini API** (not OpenAI) because it has a genuine free
tier with no credit card required.

1. Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Sign in with the same Google account
3. Click **Create API key**
4. Copy the key

**Note on model names:** Google renames/retires Gemini model versions
fairly often. The code uses `gemini-flash-latest`, which is an alias that
always points to Google's current stable Flash model, so it shouldn't
need updating even as they release new versions. If you ever see a `404`
error mentioning a model name, check Google's docs for the current alias.

---

## 5. Configure your environment file

Inside the `server/` folder:

```bash
cp .env.example .env
```

Open the new `.env` file and fill in your real Gemini key:

```
GEMINI_API_KEY=your_actual_key_here
```

(The Google Cloud speech APIs don't need a key in this file — they use
the `gcloud` login from step 3.)

---

## 6. Install dependencies and run

```bash
npm install
npm run dev
```

You should see:

```
WEG AI Tutor server running on port 3000
```

Leave this terminal running. Open a **second terminal** for testing.

---

## 7. Test it

**Quick health check** — open this in a browser:
```
http://localhost:3000/health
```
Should show `{"status":"ok"}`.

**Test the tutor logic** (text only, no voice yet) — run in a terminal:

```bash
curl -X POST http://localhost:3000/api/ask -H "Content-Type: application/json" -d "{\"text\": \"What is the area of a rectangle with length 8 and width 5?\", \"conversationId\": \"test1\", \"studentId\": \"stu_001\"}"
```

If it works, you'll get back a JSON response including a Khmer explanation
(plain text, no markdown symbols). Audio is now generated separately — call
`POST /api/tts` with `{"text": "<the reply>"}` to get the spoken version as a
base64 MP3 string.

---

## 8. Use the actual interface

Open **`weg-tutor-live.html`** in a browser. It should show **"Server
connected"** in the top right. Type a question and hit send, or use the
mic button to ask by voice.

---

## Troubleshooting log (errors we already hit, so you don't have to debug them again)

| Error | Cause | Fix |
|---|---|---|
| `npm error enoent Could not read package.json` | Ran `npm install` from the wrong folder | `cd server` first, `package.json` lives there, not in the root project folder |
| `insufficient_quota` (OpenAI) | OpenAI requires billing even for small usage | Switched to Gemini API instead (free tier, no card) |
| `429 Too Many Requests` (Gemini) | Rate limit from testing repeatedly, or model-tier mismatch | Wait ~60 seconds, or confirm you're not accidentally hitting a stricter model tier |
| `404 ... is not found for API version v1beta` | Gemini model name was retired/renamed (this happened twice as Google shipped new versions) | Use `gemini-flash-latest` alias instead of a hardcoded version number |
| `SERVICE_DISABLED` (Text-to-Speech) | The Cloud Text-to-Speech API wasn't enabled on the project | Enable it in Cloud Console → APIs & Services → Library |
| `requires a quota project, which is not set` | Local `gcloud` login had no quota project configured | Run the `set-quota-project` command, or edit the credentials JSON directly (see step 3.4) |
| `gcloud: command not found` | CLI not in the terminal's PATH (Git Bash specifically) | Switch to PowerShell terminal, or fully restart VS Code |

---

## What's still a placeholder / not yet built

- **Teacher dashboard and login** — routes exist (`/api/dashboard`,
  `/api/auth/login`) but return placeholder data, not real database
  queries yet.
- **Curriculum upload grounding** — the route exists (`/api/upload`) but
  doesn't yet save into the database or get used by the tutor logic.
- **Database** — schema is written (`database/schema.sql`) but no MySQL
  database has been created/connected yet; everything currently runs
  in-memory and resets when the server restarts.
