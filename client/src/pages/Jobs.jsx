/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react'
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

  useEffect(() => { fetchJobs() }, [])

  const fetchJobs = async () => {
    const r = await axios.get('/api/jobs')
    setJobs(r.data)
    setLoading(false)
  }

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

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="text-gray-400 mt-1">Manage job listings</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          {showForm ? 'Cancel' : '+ New Job'}
        </button>
      </div>{showForm && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold mb-6">Create Job</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-300 mb-2">Job Title</label>
                <input value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Frontend Developer" required />
              </div>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Experience Level</label>
                <select value={form.experienceLevel}
                  onChange={e => setForm({ ...form, experienceLevel: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                  <option value="junior">Junior</option>
                  <option value="mid">Mid</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Description</label>
              <textarea value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 h-28 resize-none"
                placeholder="Describe the role..." required />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Required Skills</label>
              <div className="flex gap-2 mb-2">
                <input value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="Type a skill and press Enter" />
                <button type="button" onClick={addSkill}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors">
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.requiredSkills.map(skill => (
                  <span key={skill} className="flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-sm">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} className="text-blue-300 hover:text-white ml-1">×</button>
                  </span>
                ))}
              </div>
            </div>
            <button type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Create Job
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-3">
          {jobs.map(job => (
            <div key={job._id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-5 transition-colors flex items-center justify-between">
              <div className="cursor-pointer flex-1" onClick={() => navigate(`/jobs/${job._id}/candidates`)}>
                <h3 className="font-semibold text-white">{job.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{job.experienceLevel} · {job.requiredSkills.join(', ')}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 text-sm cursor-pointer hover:text-white transition-colors"
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
                  className="text-red-500 hover:text-red-400 text-sm transition-colors px-2 py-1 rounded hover:bg-red-500/10"
                >
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