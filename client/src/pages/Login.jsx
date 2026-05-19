import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>

      {/* Glowing orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 40px rgba(124,58,237,0.5)' }}>
            <span className="text-2xl">🤖</span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">AI Resume Screener</h1>
          <p className="text-purple-300 mt-2">Sign in to your workspace</p>
        </div>

        <div className="rounded-2xl p-8 border border-white/10"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', boxShadow: '0 25px 50px rgba(0,0,0,0.4)' }}>

          {error && (
            <div className="rounded-xl p-3 mb-6 text-sm text-red-300 border border-red-500/30"
              style={{ background: 'rgba(239,68,68,0.1)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Email</label>
              <input type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none border border-white/10 focus:border-purple-500 transition-colors"
                style={{ background: 'rgba(255,255,255,0.07)' }}
                placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-200 mb-2">Password</label>
              <input type="password" value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none border border-white/10 focus:border-purple-500 transition-colors"
                style={{ background: 'rgba(255,255,255,0.07)' }}
                placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)', boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}>
              {loading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}