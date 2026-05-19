const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  uploadResume,
  getResumesByJob,
  getResume
} = require('../controllers/resumeController');

router.post('/upload', protect, upload.single('resume'), uploadResume);
router.get('/job/:jobId', protect, getResumesByJob);
router.get('/:id', protect, getResume);

// Add / update hiring manager notes
router.patch('/:id/notes', protect, async (req, res) => {
  try {
    const Resume = require('../models/Resume');
    const resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { notes: req.body.notes },
      { new: true }
    );
    res.json(resume);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;