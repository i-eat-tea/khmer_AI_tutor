// Text-to-speech service, using Google Cloud Text-to-Speech (supports Khmer).
//
// Auth: same Application Default Credentials as asr.js —
//   gcloud auth application-default login

const textToSpeech = require('@google-cloud/text-to-speech');
const client = new textToSpeech.TextToSpeechClient();

/**
 * Converts Khmer text into base64-encoded audio.
 * @param {string} text
 * @returns {Promise<string>} base64 audio (MP3)
 */
async function synthesizeSpeech(text) {
  const [response] = await client.synthesizeSpeech({
    input: { text },
    voice: {
      languageCode: 'km-KH',   // Khmer
      ssmlGender: 'FEMALE',    // pick whichever voice fits your persona best
    },
    audioConfig: { audioEncoding: 'MP3' },
  });

  return Buffer.from(response.audioContent).toString('base64');
}

module.exports = { synthesizeSpeech };
