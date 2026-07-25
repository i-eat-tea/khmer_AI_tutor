// Speech-to-text service, using Google Cloud Speech-to-Text (supports Khmer).
//
// Auth: relies on Application Default Credentials. Run this once on your
// dev machine, no key file needed:
//   gcloud auth application-default login
//
// For a deployed server later, you'd switch to a service account instead
// (see README for notes on that transition).

const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

/**
 * Transcribes base64-encoded audio into text (Khmer or English).
 * @param {string} audioBase64 - base64-encoded audio, e.g. from the browser's MediaRecorder
 * @returns {Promise<string>}
 */
async function transcribeAudio(audioBase64) {
  const [response] = await client.recognize({
    audio: { content: audioBase64 },
    config: {
      encoding: 'WEBM_OPUS',       // matches typical browser MediaRecorder output
      sampleRateHertz: 48000,
      languageCode: 'km-KH',       // Khmer
      alternativeLanguageCodes: ['en-US'], // in case a student mixes in English words
    },
  });

  if (!response.results || response.results.length === 0) {
    throw new Error('Could not understand the audio. Please try again.');
  }

  return response.results
    .map(result => result.alternatives[0].transcript)
    .join(' ');
}

module.exports = { transcribeAudio };
