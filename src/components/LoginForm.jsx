import React, { useEffect, useState } from 'react'
import { MailIcon, LockIcon, Loader2Icon, Shield, Zap, Users, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passwordFocused, setPasswordFocused] = useState(false)
  const [formVisible, setFormVisible] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // Validate email
  const validateEmail = (email) => {
    if (!email) return 'Email is required'
    if (!/\S+@\S+\.\S+/.test(email)) return 'Email address is invalid'
    return ''
  }

  // Validate password
  const validatePassword = (password) => {
    if (!password) return 'Password is required'
    if (password.length < 6) return 'Password must be at least 6 characters'
    return ''
  }

  // Animation effect when component mounts
  useEffect(() => {
    setTimeout(() => {
      setFormVisible(true)
    }, 100)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const emailValidation = validateEmail(email)
    const passwordValidation = validatePassword(password)
    setEmailError(emailValidation)
    setPasswordError(passwordValidation)
    
    if (emailValidation || passwordValidation) {
      return
    }

    // Show loading state
    setIsLoading(true)

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      console.log({
        email,
        password,
        rememberMe,
      })
      // Success handling would go here
    } catch (error) {
      console.error('Login failed:', error)
      // Error handling would go here
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-start px-4 sm:px-6 py-2 lg:px-8 relative">
             {/* Form Section - Positioned at the top */}
       <div className="w-full sm:mx-auto sm:max-w-xl relative z-10 mt-8">
         <div 
           className={`bg-white/80 backdrop-blur-xl py-12 px-10 shadow-2xl rounded-3xl border border-white/50 relative overflow-hidden transition-all duration-500 ${
             isHovering ? 'shadow-blue-500/25 scale-[1.02]' : ''
           }`}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <div className="relative z-10">
            <div className="mb-6 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 animate-fade-in">
                Welcome back
              </h2>
              <p className="text-sm text-gray-600 animate-fade-in delay-200">
                Sign in to your account to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field - Ultra compact */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1 transition-colors duration-300 group-hover:text-blue-600">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MailIcon className={`h-4 w-4 transition-all duration-300 ${emailFocused ? 'text-blue-600 scale-110' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError('')
                    }}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => {
                      setEmailFocused(false)
                      if (email) setEmailError(validateEmail(email))
                    }}
                    className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 text-base ${
                      emailError 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : emailFocused 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    placeholder="Enter your email"
                    required
                  />
                  {email && !emailError && (
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500 animate-bounce" />
                    </div>
                  )}
                </div>
                {emailError && (
                  <p className="mt-1 text-xs text-red-600 flex items-center animate-shake">
                    <XCircle className="w-3 h-3 mr-1" />
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password Field - Ultra compact */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1 transition-colors duration-300 group-hover:text-blue-600">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockIcon className={`h-4 w-4 transition-all duration-300 ${passwordFocused ? 'text-blue-600 scale-110' : 'text-gray-400 group-hover:text-gray-500'}`} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (passwordError) setPasswordError('')
                    }}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => {
                      setPasswordFocused(false)
                      if (password) setPasswordError(validatePassword(password))
                    }}
                    className={`block w-full pl-10 pr-12 py-3 border-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-100 text-base ${
                      passwordError 
                        ? 'border-red-300 focus:border-red-500 bg-red-50' 
                        : passwordFocused 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-xs text-red-600 flex items-center animate-shake">
                    <XCircle className="w-3 h-3 mr-1" />
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Remember Me & Forgot Password - Ultra compact */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                <div className="flex items-center group cursor-pointer">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200 cursor-pointer transform hover:scale-110"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer select-none transition-colors duration-200 group-hover:text-blue-600">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-all duration-200 hover:underline hover:scale-105 inline-block">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button - Ultra compact */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-4 px-6 border border-transparent text-base font-semibold rounded-xl text-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-700 hover:via-blue-800 hover:to-indigo-800 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 active:translate-y-0'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <Loader2Icon className="animate-spin h-5 w-5 mr-2" />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      Sign in
                      <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            </form>

            
          </div>
        </div>

        
      </div>

      {/* Additional Content Section - Ultra compact */}
      <div className="w-full sm:mx-auto sm:max-w-4xl relative z-10 mb-4 mt-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
          <h3 className="text-lg font-bold text-gray-900 text-center mb-3">
            Why Choose Focus Technology Solutions?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Secure</h4>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Fast</h4>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-white/50 hover:bg-white transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-indigo-600" />
              </div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Reliable</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Section - Ultra compact */}
      <div className="w-full text-center py-2 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          © 2025 Focus Technology Solutions. All rights reserved.
        </p>
      </div>
    </div>
  )
}
