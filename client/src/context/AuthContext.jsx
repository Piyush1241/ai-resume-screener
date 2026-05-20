/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''
axios.defaults.withCredentials = true

const DEV_USERS = [
  { _id: 'dev-candidate-1', name: 'User1', email: 'u1@dev.com', role: 'candidate' },
  { _id: 'dev-candidate-2', name: 'User2', email: 'u2@dev.com', role: 'candidate' },
  { _id: 'dev-admin', name: 'Piyush', email: 'piyush@admin.com', role: 'admin' },
]

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [realUser, setRealUser] = useState(null)
  const [devUser, setDevUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  axios.get('/api/auth/me')
    .then(r => setRealUser(r.data.user))
    .catch(() => setRealUser(null))
    .finally(() => setLoading(false))
}, [])

  const user = devUser ?? realUser

  const login = async (email, password) => {
    const r = await axios.post('/api/auth/login', { email, password })
    setRealUser(r.data.user)
    return r.data.user
  }

  const logout = async () => {
    await axios.post('/api/auth/logout')
    setRealUser(null)
    setDevUser(null)
  }

  const switchUser = (u) => setDevUser(u)

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">Loading...</div>

  return (
    <AuthContext.Provider value={{ user, login, logout, switchUser, DEV_USERS, devUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)