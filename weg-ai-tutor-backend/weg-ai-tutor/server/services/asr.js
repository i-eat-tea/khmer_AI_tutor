// Speech-to-text service.
// Swap the implementation below for whichever ASR provider you use
// (e.g. the ByteDance ASR used in the KIDO project, or Google Cloud Speech-to-Text,
// which both support Khmer).

/**
 * Transcribes base64-encoded audio into text (Khmer or English).
 * @param {string} audioBase64
 * @returns {Promise<string>}
 */
async function transcribeAudio(audioBase64) {
  // --- Example using Google Cloud Speech-to-Text (uncomment and configure) ---
  //
  // const speech = require('@google-cloud/speech');
  // const client = new speech.SpeechClient();
  //
  // const [response] = await client.recognize({
  //   audio: { content: audioBase64 },
  //   config: {
  //     encoding: 'WEBM_OPUS',
  //     sampleRateHertz: 48000,
  //     languageCode: 'km-KH', // Khmer
  //   },
  // });
  //
  // return response.results.map(r => r.alternatives[0].transcript).join(' ');

  throw new Error(
    'ASR not yet configured. Plug in your ASR provider (e.g. ByteDance ASR from KIDO, or Google Cloud Speech-to-Text with languageCode "km-KH") in server/services/asr.js'
  );
}

module.exports = { transcribeAudio };
