// Strips markdown / formatting characters from AI output so it renders
// cleanly on screen AND is not read aloud by TTS (no stray "*" or "#").

function sanitizeText(text) {
  if (!text) return '';
  return String(text)
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/_+/g, '')
    .replace(/`/g, '')
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

module.exports = { sanitizeText };
