require('dotenv').config();
const express = require('express');
const cors = require('cors');

const askRoute = require('./routes/ask');
const uploadRoute = require('./routes/upload');
const dashboardRoute = require('./routes/dashboard');
const authRoute = require('./routes/auth');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // larger limit for base64 audio

app.use('/api/ask', askRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/dashboard', dashboardRoute);
app.use('/api/auth', authRoute);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`WEG AI Tutor server running on port ${PORT}`);
});
