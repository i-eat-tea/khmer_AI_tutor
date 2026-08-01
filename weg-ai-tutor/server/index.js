require('dotenv').config();
const path = require('path');
const os = require('os');
const express = require('express');
const cors = require('cors');

const askRoute = require('./routes/ask');
const transcribeRoute = require('./routes/transcribe');
const ttsRoute = require('./routes/tts');
const uploadRoute = require('./routes/upload');
const dashboardRoute = require('./routes/dashboard');
const authRoute = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // larger limit for base64 audio

app.use('/api/ask', askRoute);
app.use('/api/transcribe', transcribeRoute);
app.use('/api/tts', ttsRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/auth', authRoute);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Kid-facing frontend + game assets. Only whitelisted files are served from
// the repo root, so the server folder and .env are never exposed.
const REPO_ROOT = path.resolve(__dirname, '..', '..');
app.get('/', (req, res) => res.redirect('/kid'));
app.get('/kid', (req, res) => res.sendFile(path.join(REPO_ROOT, 'weg-tutor-kid.html')));
app.get('/live', (req, res) => res.sendFile(path.join(REPO_ROOT, 'weg-tutor-live.html')));
app.get('/demo', (req, res) => res.sendFile(path.join(REPO_ROOT, 'weg-tutor-demo.html')));
app.get('/weg-games/:file', (req, res) => {
  const file = path.basename(req.params.file);
  if (!/^[a-z0-9-]+\.js$/.test(file)) return res.status(400).send('Invalid file name.');
  res.sendFile(path.join(REPO_ROOT, 'weg-games', file));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WEG AI Tutor server running on port ${PORT}`);
  const nets = os.networkInterfaces();
  let lan = null;
  outer: for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        lan = net.address;
        break outer;
      }
    }
  }
  if (lan) console.log(`Phone access (same Wi-Fi): http://${lan}:${PORT}/kid`);
});
