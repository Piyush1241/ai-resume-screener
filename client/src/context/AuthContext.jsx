/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''
axios.defaults.withCredentials = true

const DEV_USERS = [
  { _id: 'dev-admin', name: 'Piyush', email: 'piyush@dev.com', role: 'admin' },
  { _id: 'dev-candidate-1', name: 'Priya Sharma', email: 'priya@dev.com', role: 'candidate' },
  { _id: 'dev-candidate-2', name: 'Aarav Mehta', email: 'aarav@dev.com', role: 'candidate' },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('/api/auth/me')
      .then(r => setUser(r.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const r = await axios.post('/api/auth/login', { email, password })
    setUser(r.data.user)
    return r.data.user
  }

  const logout = async () => {
    await axios.post('/api/auth/logout')
    setUser(null)
  }

  const switchUser = (devUser) => setUser(devUser)

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">Loading...</div>

  return (
    <AuthContext.Provider value={{ user, login, logout, switchUser, DEV_USERS }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)