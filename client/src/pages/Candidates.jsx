/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/immutability */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout'

const scoreColor = (pct) => {
  if (pct >= 70) return 'text-green-400'
  if (pct >= 40) return 'text-yellow-400'
  return 'text-red-400'
}

const scoreBg = (pct) => {
  if (pct >= 70) return 'bg-green-500/10 border-green-500/20'
  if (pct >= 40) return 'bg-yellow-500/10 border-yellow-500/20'
  return 'bg-red-500/10 border-red-500/20'
}

const badgeColor = (rec) => {
  if (rec === 'Strong Yes') return 'bg-green-500/20 text-green-400 border-green-500/30'
  if (rec === 'Yes') return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
  if (rec === 'Maybe') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  return 'bg-red-500/20 text-red-400 border-red-500/30'
}

export default function Candidates() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [scoring, setScoring] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ candidateName: '', candidateEmail: '', file: null })

  useEffect(() => {
    fetchData()
  }, [jobId])

  const fetchData = async () => {
    const [jobRes, resumesRes] = await Promise.all([
      axios.get(`/api/jobs/${jobId}`),
      axios.get(`/api/resumes/job/${jobId}`)
    ])
    setJob(jobRes.data)
    setResumes(resumesRes.data)
    setLoading(false)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!form.file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('resume', form.file)
      fd.append('jobId', jobId)
      fd.append('candidateName', form.candidateName)
      fd.append('candidateEmail', form.candidateEmail)
      const r = await axios.post('/api/resumes/upload', fd)
      setForm({ candidateName: '', candidateEmail: '', file: null })

      // Auto-score after upload
      setScoring(r.data.resumeId)
      await axios.post(`/api/score/resume/${r.data.resumeId}`)
      setScoring(null)
      fetchData()
    } catch (err) {
      console.error(err)
    } finally {
      setUploading(false)
    }
  }

  if (loading) return (
    <Layout>
      <div className="text-gray-400">Loading...</div>
    </Layout>
  )

  return (
    <Layout>
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => navigate('/jobs')} className="text-gray-500 hover:text-white transition-colors text-sm">
          ← Jobs
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold">{job?.title}</h1>
        <p className="text-gray-400 mt-1">{job?.experienceLevel} · {job?.requiredSkills?.join(', ')}</p>
      </div>

      {/* Upload Form */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Candidate Name</label>
              <input
                value={form.candidateName}
                onChange={e => setForm({ ...form, candidateName: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="John Doe" required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Candidate Email</label>
              <input
                type="email"
                value={form.candidateEmail}
                onChange={e => setForm({ ...form, candidateEmail: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="john@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Resume PDF</label>
            <input
              type="file"
              accept=".pdf"
              onChange={e => setForm({ ...form, file: e.target.files[0] })}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:border-blue-500 file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:bg-blue-600 file:text-white hover:file:bg-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            {uploading ? 'Uploading & Scoring...' : 'Upload & Score'}
          </button>
        </form>
      </div>

      {/* Candidates List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Candidates <span className="text-gray-500 font-normal text-sm">({resumes.length})</span>
        </h2>

        {resumes.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No resumes uploaded yet.</div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume, i) => (
              <div key={resume._id}>
                <div
                  onClick={() => setSelected(selected === resume._id ? null : resume._id)}
                  className="bg-gray-900 border border-gray-800 rounded-xl p-5 cursor-pointer hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-600 text-sm font-mono w-6">#{i + 1}</span>
                      <div>
                        <h3 className="font-semibold text-white">{resume.candidateName}</h3>
                        <p className="text-gray-500 text-sm">{resume.candidateEmail || resume.fileName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {scoring === resume._id && (
                        <span className="text-yellow-400 text-sm animate-pulse">Scoring...</span>
                      )}
                      {resume.aiScore ? (
                        <>
                          <span className={`text-2xl font-bold ${scoreColor(resume.aiScore.match_percentage)}`}>
                            {resume.aiScore.match_percentage}%
                          </span>
                          <span className={`text-xs border px-2 py-1 rounded-full ${badgeColor(resume.aiScore.recommendation)}`}>
                            {resume.aiScore.recommendation}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-600 text-sm">Not scored</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Detail */}
                {selected === resume._id && resume.aiScore && (
                  <div className={`border border-t-0 rounded-b-xl p-5 ${scoreBg(resume.aiScore.match_percentage)}`}>
                    <p className="text-gray-300 text-sm mb-4">{resume.aiScore.experience_summary}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Matched Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {resume.aiScore.matched_skills.map(s => (
                            <span key={s} className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                          {resume.aiScore.matched_skills.length === 0 && <span className="text-gray-600 text-xs">None</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Missing Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {resume.aiScore.missing_skills.map(s => (
                            <span key={s} className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">{s}</span>
                          ))}
                          {resume.aiScore.missing_skills.length === 0 && <span className="text-gray-600 text-xs">None</span>}
                        </div>
                      </div>
                    </div>
                    {resume.aiScore.red_flags.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Red Flags</p>
                        <ul className="space-y-1">
                          {resume.aiScore.red_flags.map((f, i) => (
                            <li key={i} className="text-red-400 text-sm flex items-start gap-2">
                              <span className="mt-0.5">⚠</span> {f}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}