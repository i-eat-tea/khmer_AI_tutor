// Text-to-speech service, using Google Cloud Text-to-Speech (supports Khmer).
//
// Auth: same Application Default Credentials as asr.js —
//   gcloud auth application-default login

const textToSpeech = require('@google-cloud/text-to-speech');
const { sanitizeText } = require('./sanitize');
const client = new textToSpeech.TextToSpeechClient();

// Small cache so replaying the same reply (or a repeated phrase) is instant.
const MAX_CACHE = 100;
const cache = new Map();

/**
 * Converts Khmer text into base64-encoded audio.
 * @param {string} text
 * @returns {Promise<string>} base64 audio (MP3)
 */
async function synthesizeSpeech(text) {
  const cleanText = sanitizeText(text);
  if (!cleanText) return '';
  if (cache.has(cleanText)) return cache.get(cleanText);

  const [response] = await client.synthesizeSpeech({
    input: { text: cleanText },
    voice: {
      languageCode: 'km-KH',   // Khmer
      ssmlGender: 'FEMALE',    // pick whichever voice fits your persona best
    },
    audioConfig: { audioEncoding: 'MP3' },
  });

  const b64 = Buffer.from(response.audioContent).toString('base64');
  cache.set(cleanText, b64);
  if (cache.size > MAX_CACHE) cache.delete(cache.keys().next().value);
  return b64;
}

module.exports = { synthesizeSpeech };
