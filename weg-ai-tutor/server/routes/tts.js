const express = require('express');
const router = express.Router();

const { synthesizeSpeech } = require('../services/tts');

// POST /api/tts
// body: { text: string }
// Converts tutor text into Khmer speech audio. Kept separate from /api/ask so
// the text reply can reach the screen immediately while audio renders.
router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Provide text to synthesize.' });
  }

  try {
    const audioReplyBase64 = await synthesizeSpeech(text);
    res.json({ audioReplyBase64 });
  } catch (err) {
    console.error('Error in /api/tts:', err);
    res.status(500).json({ error: 'Speech synthesis failed.' });
  }
});

module.exports = router;
