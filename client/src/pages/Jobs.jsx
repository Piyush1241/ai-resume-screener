import { useState } from 'react'
import axios from 'axios'
import Layout from '../components/Layout'
import { useNavigate } from 'react-router-dom'

export default function Jobs() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [skillInput, setSkillInput] = useState('')
  const [form, setForm] = useState({
    title: '', description: '', requiredSkills: [], experienceLevel: 'junior'
  })
  const navigate = useNavigate()

  const fetchJobs = async () => {
    const r = await axios.get('/api/jobs')
    setJobs(r.data)
    setLoading(false)
  }

  useState(() => { fetchJobs() }, [])

  const addSkill = () => {
    const s = skillInput.trim()
    if (s && !form.requiredSkills.includes(s))
      setForm({ ...form, requiredSkills: [...form.requiredSkills, s] })
    setSkillInput('')
  }

  const removeSkill = (skill) =>
    setForm({ ...form, requiredSkills: form.requiredSkills.filter(s => s !== skill) })

  const handleSubmit = async (e) => {
    e.preventDefault()
    await axios.post('/api/jobs', form)
    setForm({ title: '', description: '', requiredSkills: [], experienceLevel: 'junior' })
    setShowForm(false)
    fetchJobs()
  }

  const levelColor = (level) => {
    if (level === 'senior') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    if (level === 'mid') return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    return 'text-green-400 bg-green-400/10 border-green-400/20'
  }

  const inputClass = "w-full rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none border border-white/10 focus:border-purple-500 transition-colors"
  const inputStyle = { background: 'rgba(255,255,255,0.07)' }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Jobs</h1>
          <p className="text-white/40 mt-1">Manage your job listings</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 rounded-xl font-medium text-white transition-all"
          style={showForm ? { background: 'rgba(255,255,255,0.1)' } : { background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}>
          {showForm ? '✕ Cancel' : '+ New Job'}
        </button>
      </div>

      {showForm && (
        <div className="rounded-2xl p-6 mb-8 border border-purple-500/20"
          style={{ background: 'rgba(124,58,237,0.05)', backdropFilter: 'blur(10px)' }}>
          <h2 className="text-lg font-semibold text-white mb-6">Create New Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-purple-200 mb-2">Job Title</label>
                <input value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className={inputClass} style={inputStyle}
                  placeholder="e.g. Backend Developer" required />
              </div>
              <div>
                <label className="block text-sm text-purple-200 mb-2">Experience Level</label>
                <select value={form.experienceLevel}
                  onChange={e => setForm({ ...form, experienceLevel: e.target.value })}
                  className={inputClass} style={inputStyle}>
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-purple-200 mb-2">Description</label>
              <textarea value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className={`${inputClass} h-28 resize-none`} style={inputStyle}
                placeholder="Describe the role..." required />
            </div>
            <div>
              <label className="block text-sm text-purple-200 mb-2">Required Skills</label>
              <div className="flex gap-2 mb-3">
                <input value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className={inputClass} style={inputStyle}
                  placeholder="Type a skill and press Enter" />
                <button type="button" onClick={addSkill}
                  className="px-4 py-2 rounded-xl text-white border border-white/10 hover:border-purple-500 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.07)' }}>
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.requiredSkills.map(skill => (
                  <span key={skill}
                    className="flex items-center gap-1 text-sm px-3 py-1 rounded-full border border-purple-500/30 text-purple-300"
                    style={{ background: 'rgba(124,58,237,0.15)' }}>
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)}
                      className="text-purple-400 hover:text-white ml-1 transition-colors">×</button>
                  </span>
                ))}
              </div>
            </div>
            <button type="submit"
              className="px-6 py-3 rounded-xl font-medium text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}>
              Create Job →
            </button>
          </form>
        </div>
      )}{loading ? (
        <div className="text-white/40">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-white/40">No jobs yet. Create your first one above!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job._id}
              className="rounded-2xl p-5 border border-white/10 flex items-center justify-between transition-all hover:border-purple-500/30 group"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' }}>
              <div className="flex items-center gap-4 cursor-pointer flex-1"
                onClick={() => navigate(`/jobs/${job._id}/candidates`)}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #7c3aed33, #2563eb33)' }}>
                  💼
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${levelColor(job.experienceLevel)}`}>
                      {job.experienceLevel}
                    </span>
                    <span className="text-white/30 text-xs">{job.requiredSkills.join(', ')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white/30 text-sm cursor-pointer hover:text-white transition-colors"
                  onClick={() => navigate(`/jobs/${job._id}/candidates`)}>
                  View candidates →
                </span>
                <button
                  onClick={async () => {
                    if (confirm('Delete this job?')) {
                      await axios.delete(`/api/jobs/${job._id}`)
                      fetchJobs()
                    }
                  }}
                  className="text-sm px-3 py-1 rounded-lg text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all"
                  style={{ background: 'rgba(239,68,68,0.05)' }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}