/**
 * CAREERSYNC - ADVANCED AI SERVICE
 * Logic: Senior Recruiter Role Prompting + Strict JSON MimeType
 */
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}
const genAI = new GoogleGenerativeAI(apiKey);
// Models aligned with 2026 stable standards [cite: 15, 33]

const MODELS = [
  "gemini-1.5-flash",
  "gemini-2.5-flash",      // High-performance stable model
  "gemini-3-flash-preview", // Latest frontier-class model (free tier)
  "gemini-2.5-pro"         // Advanced reasoning fallback
];

exports.analyzeResumeWithAI = async (resumeText, jobDescription) => {
  // PROMPT UPGRADE: Adding "Competitive Analysis" logic
  const prompt = `
    You are a Senior Technical Recruiter. Analyze this RESUME against the JOB DESCRIPTION.
    
    CRITICAL INSTRUCTIONS:
    - Evaluate match quality based on industry standards for 2026.
    - Provide a realistic ATS score (0-100).
    - Identify "High Impact" gaps in the Missing Skills section.

    JOB DESCRIPTION: ${jobDescription}
    RESUME TEXT: ${resumeText}

    STRICT JSON STRUCTURE (No Markdown):
    {
      "score": number,
      "breakdown": {
        "keywordMatch": number,
        "skillsMatch": number,
        "experience": number,
        "projects": number,
        "formatting": number
      },
      "summary": "2-sentence professional overview.",
      "matchedSkills": ["string"],
      "missingSkills": ["string"],
      "strengths": ["string"],
      "improvements": ["Actionable step to increase score"]
    }
  `;

  for (const modelName of MODELS) {
    try {
      const model = genAI.getGenerativeModel({ 
        model: modelName,
        generationConfig: { responseMimeType: "application/json" } // Force JSON mode
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();

      // Clean response in case AI includes markdown fences [cite: 25]
      const cleanJson = text.replace(/```json|```/g, "").trim();
      return JSON.parse(cleanJson);
    } catch (error) {
      console.warn(`[AI] Model ${modelName} failed, attempting fallback...`);
      continue; 
    }
  }
  throw new Error("AI analysis failed: Exhausted all models.");
};