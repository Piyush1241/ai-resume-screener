import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, logout, switchUser, DEV_USERS, devUser } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navLink = (to, label) => (
    <Link to={to}
      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
        location.pathname === to
          ? 'text-white border border-white/20'
          : 'text-white/50 hover:text-white hover:bg-white/5'
      }`}
      style={location.pathname === to ? { background: 'rgba(124,58,237,0.3)', boxShadow: '0 0 20px rgba(124,58,237,0.2)' } : {}}>
      {label}
    </Link>
  )

  const devSelectValue = devUser?._id || DEV_USERS[0]._id

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden"
      style={{ background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' }}>

      {/* Background orbs */}
      <div className="fixed top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />
      <div className="fixed bottom-[-200px] right-[-200px] w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #2563eb, transparent)' }} />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-white/10"
        style={{ background: 'rgba(15,12,41,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl">🤖</span>
              <span className="font-bold text-white tracking-tight">AI Resume Screener</span>
            </div>
            <div className="flex gap-1">
              {navLink('/', 'Dashboard')}
              {navLink('/jobs', 'Jobs')}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {import.meta.env.DEV && (
              <select
                value={devSelectValue}
                onChange={e => {
                  switchUser(DEV_USERS.find(u => u._id === e.target.value))
                }}
                className="text-xs rounded-lg px-2 py-1 text-white/70 border border-white/10 focus:outline-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.07)', position: 'relative', zIndex: 60 }}
                title="Dev: switch user"
              >
                {DEV_USERS.map(u => (
                  <option key={u._id} value={u._id} style={{ background: '#1a1535' }}>
                    {u.name} · {u.role}
                  </option>
                ))}
              </select>
            )}
            <div className="text-sm px-3 py-1 rounded-full border border-white/10 text-white/60"
              style={{ background: 'rgba(255,255,255,0.05)' }}>
              {user?.name} · <span className="text-purple-400">{user?.role}</span>
            </div>
            <button onClick={handleLogout}
              className="text-sm text-white/40 hover:text-white transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10">
        {children}
      </main>
    </div>
  )
}