import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Layout from '../components/Layout'

const scoreColor = (pct) => {
  if (pct >= 70) return 'text-green-400'
  if (pct >= 40) return 'text-yellow-400'
  return 'text-red-400'
}

const scoreBorder = (pct) => {
  if (pct >= 70) return 'border-green-500/30'
  if (pct >= 40) return 'border-yellow-500/30'
  return 'border-red-500/30'
}

const badgeStyle = (rec) => {
  if (rec === 'Strong Yes') return 'text-green-400 border-green-500/30 bg-green-500/10'
  if (rec === 'Yes') return 'text-blue-400 border-blue-500/30 bg-blue-500/10'
  if (rec === 'Maybe') return 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10'
  return 'text-red-400 border-red-500/30 bg-red-500/10'
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

  const fetchData = async () => {
    const [jobRes, resumesRes] = await Promise.all([
      axios.get(`/api/jobs/${jobId}`),
      axios.get(`/api/resumes/job/${jobId}`)
    ])
    setJob(jobRes.data)
    setResumes(resumesRes.data)
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [jobId])

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

  const inputClass = "w-full rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none border border-white/10 focus:border-purple-500 transition-colors"
  const inputStyle = { background: 'rgba(255,255,255,0.07)' }

  if (loading) return <Layout><div className="text-white/40">Loading...</div></Layout>

  return (
    <Layout>
      <div className="flex items-center gap-2 mb-2">
        <button onClick={() => navigate('/jobs')}
          className="text-white/30 hover:text-white transition-colors text-sm">
          ← Jobs
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white tracking-tight">{job?.title}</h1>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs px-2 py-1 rounded-full border border-purple-500/30 text-purple-300"
            style={{ background: 'rgba(124,58,237,0.1)' }}>
            {job?.experienceLevel}
          </span>
          <span className="text-white/30 text-sm">{job?.requiredSkills?.join(', ')}</span>
        </div>
      </div>

      {/* Upload Form */}
      <div className="rounded-2xl p-6 mb-8 border border-purple-500/20"
        style={{ background: 'rgba(124,58,237,0.05)', backdropFilter: 'blur(10px)' }}>
        <h2 className="text-lg font-semibold text-white mb-4">Upload Resume</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-purple-200 mb-2">Candidate Name</label>
              <input value={form.candidateName}
                onChange={e => setForm({ ...form, candidateName: e.target.value })}
                className={inputClass} style={inputStyle}
                placeholder="John Doe" required />
            </div>
            <div>
              <label className="block text-sm text-purple-200 mb-2">Candidate Email</label>
              <input type="email" value={form.candidateEmail}
                onChange={e => setForm({ ...form, candidateEmail: e.target.value })}
                className={inputClass} style={inputStyle}
                placeholder="john@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-purple-200 mb-2">Resume PDF</label>
            <input type="file" accept=".pdf"
              onChange={e => setForm({ ...form, file: e.target.files[0] })}
              className="w-full rounded-xl px-4 py-3 text-white/60 border border-white/10 focus:outline-none focus:border-purple-500 transition-colors file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-sm file:text-white cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.07)', ['--file-bg']: 'rgba(124,58,237,0.5)' }}
              required />
          </div>
          <button type="submit" disabled={uploading}
            className="px-6 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 30px rgba(124,58,237,0.3)' }}>
            {uploading ? '⏳ Uploading & Scoring...' : '🚀 Upload & Score'}
          </button>
        </form>
      </div>{/* Candidates List */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">
          Candidates <span className="text-white/30 font-normal text-sm">({resumes.length})</span>
        </h2>

        {resumes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📄</div>
            <p className="text-white/40">No resumes uploaded yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {resumes.map((resume, i) => (
              <div key={resume._id}>
                <div onClick={() => setSelected(selected === resume._id ? null : resume._id)}
                  className={`rounded-2xl p-5 border cursor-pointer transition-all hover:border-purple-500/30 ${selected === resume._id ? 'border-purple-500/40 rounded-b-none' : 'border-white/10'}`}
                  style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white/40 border border-white/10"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{resume.candidateName}</h3>
                        <p className="text-white/30 text-sm">{resume.candidateEmail || resume.fileName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {scoring === resume._id && (
                        <span className="text-purple-400 text-sm animate-pulse">✨ Scoring...</span>
                      )}
                      {resume.aiScore ? (
                        <>
                          <span className={`text-2xl font-bold ${scoreColor(resume.aiScore.match_percentage)}`}>
                            {resume.aiScore.match_percentage}%
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full border ${badgeStyle(resume.aiScore.recommendation)}`}>
                            {resume.aiScore.recommendation}
                          </span>
                          <span className="text-white/20 text-sm">{selected === resume._id ? '▲' : '▼'}</span>
                        </>
                      ) : (
                        <span className="text-white/20 text-sm">Not scored</span>
                      )}
                    </div>
                  </div>
                </div>

                {selected === resume._id && resume.aiScore && (
                  <div className={`rounded-b-2xl border border-t-0 p-5 ${scoreBorder(resume.aiScore.match_percentage)}`}
                    style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)' }}>
                    <p className="text-white/60 text-sm mb-5">{resume.aiScore.experience_summary}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-white/30 uppercase tracking-wider mb-2">✅ Matched Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {resume.aiScore.matched_skills.map(s => (
                            <span key={s} className="text-xs px-2 py-0.5 rounded-full border border-green-500/30 text-green-400"
                              style={{ background: 'rgba(34,197,94,0.1)' }}>{s}</span>
                          ))}
                          {resume.aiScore.matched_skills.length === 0 &&
                            <span className="text-white/20 text-xs">None</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-white/30 uppercase tracking-wider mb-2">❌ Missing Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {resume.aiScore.missing_skills.map(s => (
                            <span key={s} className="text-xs px-2 py-0.5 rounded-full border border-red-500/30 text-red-400"
                              style={{ background: 'rgba(239,68,68,0.1)' }}>{s}</span>
                          ))}
                          {resume.aiScore.missing_skills.length === 0 &&
                            <span className="text-white/20 text-xs">None</span>}
                        </div>
                      </div>
                    </div>
                    {resume.aiScore.red_flags.length > 0 && (
                      <div>
                        <p className="text-xs text-white/30 uppercase tracking-wider mb-2">⚠️ Red Flags</p>
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