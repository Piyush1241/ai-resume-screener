import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout'

export default function Dashboard() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    axios.get('/api/jobs')
      .then(r => setJobs(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const levelColor = (level) => {
    if (level === 'senior') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
    if (level === 'mid') return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
    return 'text-green-400 bg-green-400/10 border-green-400/20'
  }

  return (
    <Layout>
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-white/40 mt-1">Overview of all active job listings</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Active Jobs', value: jobs.length, icon: '💼' },
          { label: 'Total Roles', value: jobs.length, icon: '📋' },
          { label: 'AI Powered', value: '100%', icon: '🤖' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl p-5 border border-white/10"
            style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' }}>
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-white/40 text-sm mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Jobs grid */}
      {loading ? (
        <div className="text-white/40">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-white/40 mb-4">No jobs yet</p>
          <button onClick={() => navigate('/jobs')}
            className="px-6 py-3 rounded-xl font-medium text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}>
            Create your first job →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <div key={job._id} onClick={() => navigate(`/jobs/${job._id}/candidates`)}
              className="rounded-2xl p-6 border border-white/10 cursor-pointer transition-all hover:border-purple-500/50 hover:scale-[1.02] group"
              style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                  style={{ background: 'linear-gradient(135deg, #7c3aed33, #2563eb33)' }}>
                  💼
                </div>
                <span className={`text-xs px-2 py-1 rounded-full border ${levelColor(job.experienceLevel)}`}>
                  {job.experienceLevel}
                </span>
              </div>
              <h3 className="font-semibold text-white text-lg mb-2 group-hover:text-purple-300 transition-colors">
                {job.title}
              </h3>
              <p className="text-white/40 text-sm mb-4 line-clamp-2">{job.description}</p>
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills.slice(0, 3).map(skill => (
                  <span key={skill}
                    className="text-xs px-2 py-0.5 rounded-full border border-purple-500/30 text-purple-300"
                    style={{ background: 'rgba(124,58,237,0.1)' }}>
                    {skill}
                  </span>
                ))}
                {job.requiredSkills.length > 3 && (
                  <span className="text-xs text-white/30">+{job.requiredSkills.length - 3}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}