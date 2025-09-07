import React, { useEffect, useState } from 'react'
import { auth } from '../../AUTH/firebase-auth'
import { Navigate, useLocation } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'

const AuthRequired = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default AuthRequired