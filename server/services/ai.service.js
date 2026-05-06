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
 const prompt = `
### ROLE
You are a Senior Technical Recruiter and ATS (Applicant Tracking System) evaluator with 20+ years of experience hiring software engineers (especially MERN stack).

---

### TASK
1. EXTRACT a professional profile from the resume
2. ANALYZE how well the resume matches the Job Description (JD)
3. SCORE the candidate using ATS-style evaluation
4. SUGGEST improvements
5. GENERATE a job search query

---

### INPUT DATA
- JOB DESCRIPTION: ${jobDescription}
- RESUME TEXT: ${resumeText}

---

### SCORING RULES (CRITICAL — MUST FOLLOW)

- ALL breakdown values MUST be percentages (0–100)
- Each metric is INDEPENDENT (NOT part of a sum)
- DO NOT make breakdown values add up to total score
- The final ATS score MUST be a realistic weighted average

#### Metrics Definition:

1. Keyword Match (0–100)
   → % of important keywords from JD found in resume

2. Skills Match (0–100)
   → how well candidate's skills align conceptually with JD

3. Experience (0–100)
   → alignment of years + relevance of experience

4. Projects (0–100)
   → quality and relevance of projects to JD

5. Formatting (0–100)
   → readability, structure, ATS-friendliness

---

### ATS SCORE CALCULATION (IMPORTANT)

The final score should be a realistic weighted average:

- Skills Match → highest importance
- Keyword Match → high importance
- Experience → medium importance
- Projects → medium importance
- Formatting → low importance

⚠️ DO NOT sum values
⚠️ DO NOT return random numbers
⚠️ Score must reflect real hiring standards

---

### STRICTNESS RULES

- Fresher profiles should rarely exceed 75–80 unless exceptional
- Be realistic, not generous
- Penalize missing core skills properly
- Avoid hallucinations (do NOT invent experience)

---

### OUTPUT FORMAT (STRICT JSON ONLY — NO TEXT, NO MARKDOWN)

{
  "extractedProfile": {
    "role": "string",
    "seniority": "Fresher | Junior | Mid | Senior",
    "yearsOfExp": number,
    "skills": ["top 8 relevant technical skills"]
  },
  "atsReport": {
    "score": number,
    "breakdown": {
      "keywordMatch": number,
      "skillsMatch": number,
      "experience": number,
      "projects": number,
      "formatting": number
    },
    "summary": "2–3 line professional evaluation",
    "matchedSkills": ["skills present in both JD and resume"],
    "missingSkills": ["critical missing skills from JD"],
    "strengths": ["3 strong points"],
    "improvements": ["3 actionable improvements"]
  },
  "jobSearchQuery": "optimized 3-word job query"
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