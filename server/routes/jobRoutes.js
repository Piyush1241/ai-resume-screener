const router = require('express').Router();
const Job = require('../models/Job');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// All users can view active jobs
router.get('/', async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort('-createdAt');
    res.json(jobs);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Recruiters and admins can create / update jobs
router.post('/', authorize('admin', 'recruiter'), async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(job);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id', authorize('admin', 'recruiter'), async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(job);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// Only admins can archive jobs
router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    await Job.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Job archived' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
