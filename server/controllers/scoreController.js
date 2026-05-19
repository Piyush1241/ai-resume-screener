const Groq = require('groq-sdk');
const Resume = require('../models/Resume');
const Job = require('../models/Job');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const buildPrompt = (job, resumeText) => `
You are an expert technical recruiter. Analyze this resume against the job description.
Return ONLY a valid JSON object with exactly these fields — no extra text, no markdown fences:
{
  "match_percentage": <number 0-100>,
  "matched_skills": <array of skill strings>,
  "missing_skills": <array of skill strings>,
  "experience_summary": "<string, max 2 sentences>",
  "red_flags": <array of strings, empty array if none>,
  "recommendation": "<exactly one of: Strong Yes | Yes | Maybe | No>"
}

JOB TITLE: ${job.title}
EXPERIENCE LEVEL REQUIRED: ${job.experienceLevel}
REQUIRED SKILLS: ${job.requiredSkills.join(', ')}

JOB DESCRIPTION:
${job.description}

RESUME TEXT:
${resumeText.slice(0, 4000)}
`;

const callGroq = async (prompt) => {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000,
    temperature: 0.1
  });
  const raw = response.choices[0].message.content.trim();
  const clean = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(clean);
};

exports.scoreResume = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const resume = await Resume.findById(resumeId);
    const job = resume ? await Job.findById(resume.jobId) : null;

    if (!resume || !job)
      return res.status(404).json({ message: 'Resume or job not found' });
    if (!resume.rawText)
      return res.status(400).json({ message: 'Resume text not extracted yet' });

    const aiScore = await callGroq(buildPrompt(job, resume.rawText));
    resume.aiScore = aiScore;
    resume.scoredAt = new Date();
    await resume.save();

    res.json({ success: true, aiScore });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.scoreBatch = async (req, res) => {
  try {
    const { jobId } = req.params;
    const unscored = await Resume.find({
      jobId,
      'aiScore.match_percentage': { $exists: false }
    });

    if (!unscored.length)
      return res.json({ message: 'All resumes already scored', scored: 0 });

    const results = [];
    for (const resume of unscored) {
      const job = await Job.findById(resume.jobId);
      if (!resume.rawText || !job) {
        results.push({ resumeId: resume._id, error: 'Missing text or job' });
        continue;
      }
      try {
        const aiScore = await callGroq(buildPrompt(job, resume.rawText));
        resume.aiScore = aiScore;
        resume.scoredAt = new Date();
        await resume.save();
        results.push({ resumeId: resume._id, success: true, match: aiScore.match_percentage });
      } catch (e) {
        results.push({ resumeId: resume._id, error: e.message });
      }
    }
    res.json({ scored: results.length, results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};