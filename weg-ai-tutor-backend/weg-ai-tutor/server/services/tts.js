// Text-to-speech service.
// Swap in OpenAI TTS (used in KIDO) or Google Cloud Text-to-Speech (Khmer support).

/**
 * Converts Khmer text into base64-encoded audio.
 * @param {string} text
 * @returns {Promise<string>} base64 audio
 */
async function synthesizeSpeech(text) {
  // --- Example using OpenAI TTS (uncomment and configure) ---
  //
  // const OpenAI = require('openai');
  // const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  //
  // const response = await client.audio.speech.create({
  //   model: 'tts-1',
  //   voice: 'alloy',
  //   input: text,
  // });
  //
  // const buffer = Buffer.from(await response.arrayBuffer());
  // return buffer.toString('base64');

  throw new Error(
    'TTS not yet configured. Plug in OpenAI TTS or Google Cloud Text-to-Speech (Khmer) in server/services/tts.js'
  );
}

module.exports = { synthesizeSpeech };
