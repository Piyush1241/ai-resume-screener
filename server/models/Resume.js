const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  candidateName: String,
  candidateEmail: String,
  fileUrl: String,       // Cloudinary URL (added in Phase 2)
  rawText: String,       // Extracted PDF text (added in Phase 2)
  uploadedBy: String,    // UUID from PostgreSQL users
  aiScore: {
    match_percentage: Number,
    matched_skills: [String],
    missing_skills: [String],
    experience_summary: String,
    red_flags: [String],
    recommendation: {
      type: String,
      enum: ['Strong Yes', 'Yes', 'Maybe', 'No']
    }
  },
  scoredAt: Date,
  notes: String          // Hiring manager notes
}, { timestamps: true });

module.exports = mongoose.model('Resume', resumeSchema);
