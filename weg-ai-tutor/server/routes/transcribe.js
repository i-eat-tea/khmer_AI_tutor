const express = require('express');
const router = express.Router();

const { transcribeAudio } = require('../services/asr');

// POST /api/transcribe
// body: { audioBase64, encoding? }
// Returns only the transcription, so the frontend can show "I heard: X"
// and confirm before the audio is sent to the tutor logic. Keeps the
// confirm step a single extra round-trip (no tutor call on a misheard word).
router.post('/', async (req, res) => {
  try {
    const { audioBase64, encoding } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 is required.' });
    }

    const t0 = Date.now();
    const studentText = await transcribeAudio(audioBase64, encoding);
    console.log(`[transcribe] ASR took ${Date.now() - t0}ms`);

    res.json({ studentText });
  } catch (err) {
    console.error('Error in /api/transcribe:', err);
    res.status(500).json({ error: 'Could not understand the audio. Please try again.' });
  }
});

module.exports = router;
