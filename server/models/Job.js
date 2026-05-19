const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requiredSkills: [String],
  experienceLevel: {
    type: String,
    enum: ['junior', 'mid', 'senior'],
    default: 'mid'
  },
  createdBy: { type: String, required: true }, // UUID from PostgreSQL users
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Job', jobSchema);
