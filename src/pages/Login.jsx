import React, { useEffect, useState } from 'react'
import cloudImage from '../assets/cloud-upload-icon-line-connection-circuit-board.jpg'
import LogoFocus from '../assets/LogoFocus2.png'

const Login = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    
    try {
      // Basic validation
      if (!email || !password) {
        setError('Please fill in all fields')
        return
      }
      
      // Accept all credentials
      const validCredentials = [
        { username: 'subprovider', password: 'password123', role: 'subprovider' },
        { username: 'partner', password: 'password123', role: 'partner' },
        { username: 'user', password: 'password123', role: 'user' },
        { username: 'admin', password: 'password123', role: 'admin' },
        { username: 'client', password: 'password123', role: 'user' }
      ]
      
      const validUser = validCredentials.find(cred => 
        cred.username === email && cred.password === password
      )
      
      if (validUser) {
        // Store user data
        localStorage.setItem('userData', JSON.stringify({
          username: validUser.username,
          role: validUser.role
        }))
        
        // Redirect based on user role
        if (validUser.role === 'user') {
          window.location.href = '/user-dashboard'
        } else {
          window.location.href = '/dashboard'
        }
        
      } else {
        setError('Invalid credentials. Use: subprovider/password123, partner/password123, user/password123, admin/password123, or client/password123')
      }
      
    } catch (err) {
      console.error('Login error:', err)
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div 
      className="w-full h-screen overflow-hidden relative bg-black"
      style={{
        backgroundImage: `url(${cloudImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Glassmorphism Login Form */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-md mx-4">
          {/* Form Container with Glassmorphism Effect */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
            {/* Header with Logo */}
            <div className="text-center mb-8">
              {/* Logo - Centered and Larger */}
              <div className="mb-6 flex justify-center items-center">
                <img
                  src={LogoFocus}
                  alt="Focus Technology Solutions"
                  className="h-40 w-auto object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-white/80">Sign in with your username to continue</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                  Username
                </label>
                <input 
                  type="text" 
                  id="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
                  required
                  disabled={isLoading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300 pr-12"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="text-right">
                <a href="#" className="text-blue-300 hover:text-blue-200 text-sm transition-colors">
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
