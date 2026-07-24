const express = require('express');
const router = express.Router();

const { transcribeAudio } = require('../services/asr');
const { getTutorReply } = require('../services/tutor');
const { synthesizeSpeech } = require('../services/tts');

// POST /api/ask
// body: { audioBase64?: string, text?: string, conversationId: string, studentId: string }
// Accepts EITHER audio (to be transcribed) OR plain text (for text-only testing).
router.post('/', async (req, res) => {
  try {
    const { audioBase64, text, conversationId, studentId } = req.body;

    if (!audioBase64 && !text) {
      return res.status(400).json({ error: 'Provide either audioBase64 or text.' });
    }

    // Step 1: get the student's question as Khmer/English text
    const studentText = audioBase64
      ? await transcribeAudio(audioBase64)
      : text;

    // Step 2: get curriculum-grounded, step-by-step tutor reply
    const tutorReply = await getTutorReply({
      studentText,
      conversationId,
      studentId
    });

    // Step 3: convert reply to Khmer speech
    const audioReplyBase64 = await synthesizeSpeech(tutorReply.text);

    res.json({
      studentText,
      tutorText: tutorReply.text,
      stepNumber: tutorReply.stepNumber,
      audioReplyBase64
    });
  } catch (err) {
    console.error('Error in /api/ask:', err);
    res.status(500).json({ error: 'Something went wrong processing the question.' });
  }
});

module.exports = router;
