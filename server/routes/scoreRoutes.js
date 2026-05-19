const router = require('express').Router();
const { scoreResume, scoreBatch } = require('../controllers/scoreController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Score a single resume
router.post('/resume/:resumeId', authorize('admin', 'recruiter'), scoreResume);

// Batch score all unscored resumes for a job
router.post('/batch/:jobId', authorize('admin', 'recruiter'), scoreBatch);

module.exports = router;
