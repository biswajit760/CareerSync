const crypto = require('crypto');

/**
 * Generate a unique hash identifier from resume text content
 * This helps identify when the same resume is scanned multiple times
 * @param {string} resumeText - The raw text content of the resume
 * @returns {string} - A SHA256 hash of the resume content
 */
function generateResumeHash(resumeText) {
  if (!resumeText || typeof resumeText !== 'string') {
    throw new Error('Invalid resume text provided');
  }

  // Normalize the text: remove extra whitespace, convert to lowercase
  const normalizedText = resumeText
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

  // Generate SHA256 hash
  const hash = crypto
    .createHash('sha256')
    .update(normalizedText)
    .digest('hex');

  // Return first 16 characters for shorter identifier
  return hash.substring(0, 16);
}

module.exports = generateResumeHash;
