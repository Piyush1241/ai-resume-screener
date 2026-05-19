const pdfParse = require('pdf-parse');
const Resume = require('../models/Resume');

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No PDF uploaded' });

    const { jobId, candidateName, candidateEmail } = req.body;
    if (!jobId) return res.status(400).json({ message: 'jobId is required' });

    const parsed = await pdfParse(req.file.buffer);
    const rawText = parsed.text;

    const resume = await Resume.create({
      jobId,
      candidateName: candidateName || 'Unknown',
      candidateEmail: candidateEmail || '',
      fileName: req.file.originalname,
      fileSize: req.file.size,
      rawText
    });

    res.status(201).json({
      success: true,
      resumeId: resume._id,
      candidateName: resume.candidateName,
      textLength: rawText.length
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResumesByJob = async (req, res) => {
  try {
    const resumes = await Resume.find({ jobId: req.params.jobId })
      .select('-rawText')
      .sort({ 'aiScore.match_percentage': -1 });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};