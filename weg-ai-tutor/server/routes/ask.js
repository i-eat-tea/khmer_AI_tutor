const express = require('express');
const router = express.Router();

const { transcribeAudio } = require('../services/asr');
const { getTutorReply } = require('../services/tutor');
const { synthesizeSpeech } = require('../services/tts');

// POST /api/ask
// body: { audioBase64?: string, text?: string, encoding?: string, conversationId: string, studentId: string, tts?: boolean }
// Accepts EITHER audio (to be transcribed) OR plain text (for text-only testing).
// TTS is NOT generated unless `tts: true` is passed, so text replies come back
// fast; the frontend calls /api/tts separately to get audio.
router.post('/', async (req, res) => {
  const tStart = Date.now();
  try {
    const { audioBase64, text, encoding, conversationId, studentId, tts } = req.body;

    if (!audioBase64 && !text) {
      return res.status(400).json({ error: 'Provide either audioBase64 or text.' });
    }

    // Step 1: get the student's question as Khmer/English text
    const studentText = audioBase64
      ? await transcribeAudio(audioBase64, encoding)
      : text;
    if (audioBase64) console.log(`[ask] ASR took ${Date.now() - tStart}ms`);

    // Step 2: get curriculum-grounded, step-by-step tutor reply
    const tutorReply = await getTutorReply({
      studentText,
      conversationId,
      studentId
    });
    console.log(`[ask] Gemini took ${Date.now() - tStart}ms`);

    const payload = {
      studentText,
      tutorText: tutorReply.text,
      stepNumber: tutorReply.stepNumber
    };

    // Step 3 (optional): convert reply to Khmer speech
    if (tts) {
      payload.audioReplyBase64 = await synthesizeSpeech(tutorReply.text);
      console.log(`[ask] TTS took ${Date.now() - tStart}ms`);
    }

    console.log(`[ask] TOTAL ${Date.now() - tStart}ms | convo=${conversationId}`);
    res.json(payload);
  } catch (err) {
    console.error('Error in /api/ask:', err);
    res.status(500).json({ error: 'Something went wrong processing the question.' });
  }
});

module.exports = router;
