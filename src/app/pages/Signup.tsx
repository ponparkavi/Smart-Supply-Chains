import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Eye, EyeOff, Lock, User, Mail, ArrowRight, Box, Ship, Route, CheckCircle } from 'lucide-react';
import { useRole } from '../context/RoleContext';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useRole();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'operator' as 'admin' | 'operator',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleRoleChange = (role: 'admin' | 'operator') => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSignup = () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      register(formData.username, formData.email, formData.password, formData.role);
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white">
      {/* Left Side - Illustration */}
      <div className="relative w-full md:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden">
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating nodes and routes illustration */}
        <div className="relative z-10 w-full max-w-md">
          <svg viewBox="0 0 400 320" className="w-full h-auto drop-shadow-2xl">
            {/* Connection routes */}
            <path d="M 80 120 Q 200 60 320 100" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="6,4" />
            <path d="M 80 200 Q 180 260 320 220" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" strokeDasharray="6,4" />
            <path d="M 80 120 Q 140 180 320 220" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="6,4" />
            <path d="M 80 200 Q 200 140 320 100" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="6,4" />

            {/* Nodes */}
            <circle cx="80" cy="120" r="24" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
            <circle cx="80" cy="200" r="20" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            <circle cx="320" cy="100" r="28" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
            <circle cx="320" cy="220" r="22" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
            <circle cx="200" cy="160" r="16" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />

            {/* Inner icons (simplified as circles/dots) */}
            <circle cx="80" cy="120" r="6" fill="white" />
            <circle cx="80" cy="200" r="5" fill="white" opacity="0.8" />
            <circle cx="320" cy="100" r="7" fill="white" />
            <circle cx="320" cy="220" r="5" fill="white" opacity="0.8" />
            <circle cx="200" cy="160" r="4" fill="white" />

            {/* Pulse rings */}
            <circle cx="200" cy="160" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
              <animate attributeName="r" from="30" to="50" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.3" to="0" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="160" r="30" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1">
              <animate attributeName="r" from="30" to="50" dur="3s" begin="1.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" from="0.3" to="0" dur="3s" begin="1.5s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* Icons overlay */}
          <div className="flex justify-center gap-6 mt-8">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Ship className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Route className="w-6 h-6 text-white" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Box className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="relative z-10 mt-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Join PulseChain</h2>
          <p className="text-blue-100 text-sm md:text-base max-w-xs mx-auto">
            Create your account and take control of your supply chain.
          </p>
        </div>
      </div>

      {/* Right Side - Signup Card */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 mb-4 shadow-md">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h1>
              <p className="text-sm text-gray-500 mt-1">Join the PulseChain platform</p>
            </div>

            {/* Form */}
            <div className="space-y-5">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-gray-50/50"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-gray-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-11 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm bg-gray-50/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                      formData.role === 'admin'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Box className="w-5 h-5" />
                    <span className="text-sm font-medium">Admin</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('operator')}
                    className={`py-3 px-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-1 ${
                      formData.role === 'operator'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <Ship className="w-5 h-5" />
                    <span className="text-sm font-medium">Operator</span>
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  I agree to the{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700 underline">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-blue-600 hover:text-blue-700 underline">
                    Privacy Policy
                  </button>
                </span>
              </label>

              {/* Submit Button */}
              <button
                onClick={handleSignup}
                disabled={isLoading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-gray-400">already have an account</span>
                </div>
              </div>

              {/* Login Link */}
              <Link
                to="/login"
                className="w-full py-3 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700 hover:text-blue-700 rounded-xl font-medium transition-all duration-200 text-center block text-sm"
              >
                Sign In instead
              </Link>
            </div>

            {/* Footer */}
            <p className="text-center text-xs text-gray-400 mt-8">
              Secure enterprise registration. All connections are encrypted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
