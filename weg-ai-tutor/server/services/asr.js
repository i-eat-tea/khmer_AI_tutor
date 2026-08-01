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
const { phrases } = require('./khmer-vocab-hints');

/**
 * Transcribes base64-encoded audio into text (Khmer or English).
 * @param {string} audioBase64 - base64-encoded audio, e.g. from the browser's MediaRecorder
 * @param {string} [encoding] - 'WEBM_OPUS' (default) or 'MP4' (iPhone/MPEG-4 AAC)
 * @returns {Promise<string>}
 */
async function transcribeAudio(audioBase64, encoding) {
  const isMp4 = encoding === 'MP4';
  const config = {
    encoding: isMp4 ? 'MP4' : 'WEBM_OPUS',
    languageCode: 'km-KH',       // Khmer
    alternativeLanguageCodes: ['en-US'], // in case a student mixes in English words
    // Speech adaptation: bias recognition toward expected curriculum
    // vocabulary (helps a lot with children's speech patterns).
    speechContexts: [{ phrases }],
  };
  // WEBM_OPUS from Chrome needs an explicit sample rate; MP4/AAC is
  // self-describing, so omitting sampleRateHertz lets Google read it.
  if (!isMp4) {
    config.sampleRateHertz = 48000;
  }

  const [response] = await client.recognize({
    audio: { content: audioBase64 },
    config,
  });

  if (!response.results || response.results.length === 0) {
    throw new Error('Could not understand the audio. Please try again.');
  }

  return response.results
    .map(result => result.alternatives[0].transcript)
    .join(' ');
}

module.exports = { transcribeAudio };
