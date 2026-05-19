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

  // eslint-disable-next-line no-unused-vars
  const scoreColor = (pct) => {
    if (pct >= 70) return 'text-green-400'
    if (pct >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of all active jobs</p>
      </div>

      {loading ? (
        <div className="text-gray-400">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No jobs yet. <span className="text-blue-400 cursor-pointer" onClick={() => navigate('/jobs')}>Create one →</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <div
              key={job._id}
              onClick={() => navigate(`/jobs/${job._id}/candidates`)}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-white">{job.title}</h3>
                <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded-full">{job.experienceLevel}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{job.description}</p>
              <div className="flex flex-wrap gap-1">
                {job.requiredSkills.slice(0, 3).map(skill => (
                  <span key={skill} className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
                {job.requiredSkills.length > 3 && (
                  <span className="text-xs text-gray-500">+{job.requiredSkills.length - 3} more</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  )
}