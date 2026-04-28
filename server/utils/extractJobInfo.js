/**
 * Extract job title and company name from job description
 * Uses regex patterns to identify common formats
 * @param {string} jobDescription - The job description text
 * @returns {object} - { jobTitle, companyName }
 */
function extractJobInfo(jobDescription) {
  if (!jobDescription || typeof jobDescription !== 'string') {
    return {
      jobTitle: 'Untitled Position',
      companyName: '',
    };
  }

  let jobTitle = 'Untitled Position';
  let companyName = '';

  // Common patterns for job titles
  const titlePatterns = [
    /(?:position|role|job\s*title|title|opening|vacancy)[\s:]+([^\n.]+)/i,
    /(?:hiring|looking\s*for|seeking)[\s:]+(?:a\s+)?([^\n.]+?)(?:\s+at|\s+for|\s+in|$)/i,
    /^([^\n]+?)(?:\s+at\s+|\s+-\s+|\n)/i, // First line before "at" or "-"
  ];

  // Try to extract job title
  for (const pattern of titlePatterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      jobTitle = match[1].trim();
      // Clean up common prefixes
      jobTitle = jobTitle.replace(/^(a|an|the)\s+/i, '');
      // Limit length
      if (jobTitle.length > 100) {
        jobTitle = jobTitle.substring(0, 100);
      }
      break;
    }
  }

  // Common patterns for company names
  const companyPatterns = [
    /(?:company|organization|firm)[\s:]+([^\n.]+)/i,
    /(?:at|@|for)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s+is|\s+seeks|\s+looking|,|\.|$)/,
    /([A-Z][A-Za-z0-9\s&.]+?)\s+(?:is\s+)?(?:hiring|seeking|looking\s+for)/,
  ];

  // Try to extract company name
  for (const pattern of companyPatterns) {
    const match = jobDescription.match(pattern);
    if (match && match[1]) {
      companyName = match[1].trim();
      // Limit length
      if (companyName.length > 100) {
        companyName = companyName.substring(0, 100);
      }
      break;
    }
  }

  return {
    jobTitle,
    companyName,
  };
}

module.exports = extractJobInfo;
