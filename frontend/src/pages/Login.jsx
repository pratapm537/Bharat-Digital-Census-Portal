import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { authAPI } from '../services/api.js';
import { Landmark, ShieldAlert, Key, Smartphone, ArrowRight, UserCheck, Shield, FileText } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  
  // Tabs: 'CITIZEN' or 'OFFICER'
  const [role, setRole] = useState('CITIZEN');
  
  // Phase of Citizen login: 'AADHAAR' -> 'OTP' or 'SIGNUP'
  const [phase, setPhase] = useState('AADHAAR');

  // Input states
  const [aadhaar, setAadhaar] = useState('');
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // UI state messages
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if query param specifies signup mode
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setPhase('AADHAAR'); // Start from Aadhaar to prevent duplicate signups
    }
  }, [searchParams]);

  const handleAadhaarCheck = async (e) => {
    e.preventDefault();
    setError('');
    
    if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
      setError('Aadhaar must be exactly 12 numerical digits.');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.checkAadhaar(aadhaar);
      if (response.data.exists) {
        // Aadhaar registered, send OTP simulation
        setSuccess('Aadhaar found. OTP request sent (Simulated).');
        setPhone('9876543210'); // Mock phone matching user profile
        handleSendOtp(null, '9876543210', aadhaar);
      } else {
        // Create new account
        setSuccess('Aadhaar verified. Complete signup registration.');
        setPhase('SIGNUP');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e, customPhone, targetAadhaar) => {
    if (e) e.preventDefault();
    setError('');
    
    const targetPhone = customPhone || phone;
    const currentAadhaar = targetAadhaar || aadhaar;

    if (!targetPhone || targetPhone.length !== 10) {
      setError('Enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.sendOtp(targetPhone, currentAadhaar);
      setSuccess(response.data.message);
      setPhase('OTP');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.verifyOtp(phone, otp);
      login(response.data.token, response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP verification code.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!fullName || fullName.trim().length < 3) {
      setError('Enter your full legal name.');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.register({
        aadhaar,
        phone,
        fullName,
        dob,
        gender
      });
      
      login(response.data.token, response.data.user);
      navigate('/wizard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleOfficerLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.loginOfficer(username, password);
      login(response.data.token, response.data.user);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md bg-surface border border-outlineVariant/30 rounded-md p-8 shadow-premium">
        
        {/* Toggle Login Type Tabs */}
        <div className="flex border-b border-outlineVariant/30 mb-6">
          <button 
            type="button"
            onClick={() => { setRole('CITIZEN'); setError(''); setSuccess(''); }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all ${
              role === 'CITIZEN' ? 'border-primary text-primary' : 'border-transparent text-onSurfaceVariant hover:text-primary'
            }`}
          >
            Citizen Access
          </button>
          <button 
            type="button"
            onClick={() => { setRole('OFFICER'); setError(''); setSuccess(''); }}
            className={`flex-1 pb-3 text-sm font-semibold border-b-2 text-center transition-all ${
              role === 'OFFICER' ? 'border-primary text-primary' : 'border-transparent text-onSurfaceVariant hover:text-primary'
            }`}
          >
            Census Officer
          </button>
        </div>

        {/* Global Notifications */}
        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-md border border-red-200 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-700 text-xs p-3 rounded-md border border-green-200 mb-4 flex items-center gap-2 animate-fade-in">
            <UserCheck className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Citizen Flow Panels */}
        {role === 'CITIZEN' && (
          <>
            {phase === 'AADHAAR' && (
              <form onSubmit={handleAadhaarCheck} className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-primary mb-1">Verify Identity</h3>
                  <p className="text-xs text-onSurfaceVariant">Enter your Aadhaar card number to authenticate or start registration.</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">12-Digit Aadhaar Number</label>
                  <input 
                    type="text" 
                    maxLength={12}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                    placeholder="0000 0000 0000"
                    required
                    className="w-full px-4 py-2.5 bg-surface border border-outlineVariant rounded-md text-sm font-medium tracking-wider outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-center"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary-light py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-ambient transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Validating...' : 'Verify Aadhaar'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {phase === 'OTP' && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-primary mb-1">Enter Verification Code</h3>
                  <p className="text-xs text-onSurfaceVariant">OTP sent to Aadhaar linked mobile ending in {phone.slice(-4)}</p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-primary">Enter OTP</label>
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    required
                    className="w-full px-4 py-2.5 bg-surface border border-outlineVariant rounded-md text-sm font-medium tracking-widest outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-center"
                  />
                  <p className="text-[10px] text-onSurfaceVariant mt-1">Simulation notice: Enter code <strong>123456</strong></p>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary-light py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-ambient transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Authenticate Login'}
                </button>

                <button 
                  type="button"
                  onClick={() => setPhase('AADHAAR')}
                  className="w-full text-center text-xs text-primary font-medium hover:underline mt-2 cursor-pointer"
                >
                  Back to Aadhaar Validation
                </button>
              </form>
            )}

            {phase === 'SIGNUP' && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-primary mb-1">Create Citizen Profile</h3>
                  <p className="text-xs text-onSurfaceVariant">Provide basic registry details to complete signup.</p>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-primary">Aadhaar (Verified)</label>
                  <input 
                    type="text" 
                    disabled 
                    value={aadhaar} 
                    className="w-full px-4 py-2 bg-surface-container/50 border border-outlineVariant rounded-md text-xs font-semibold tracking-wider text-onSurfaceVariant" 
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-primary">Full Legal Name</label>
                  <input 
                    type="text" 
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Rahul Sharma"
                    className="w-full px-4 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-primary">Mobile Number</label>
                  <input 
                    type="text" 
                    maxLength={10}
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="9876543210"
                    className="w-full px-4 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-primary">Date of Birth</label>
                    <input 
                      type="date" 
                      required
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-xs outline-none focus:border-primary focus:ring-2"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-primary">Gender</label>
                    <select 
                      required
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full px-3 py-2 bg-surface border border-outlineVariant rounded-md text-xs outline-none focus:border-primary focus:ring-2"
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Transgender">Transgender</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-primary text-white hover:bg-primary-light py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-ambient transition-all cursor-pointer mt-4"
                >
                  {loading ? 'Creating...' : 'Register & Create Profile'}
                </button>
              </form>
            )}
          </>
        )}

        {/* Officer Flow Panel */}
        {role === 'OFFICER' && (
          <form onSubmit={handleOfficerLogin} className="space-y-5">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-primary mb-1">Officer Login</h3>
              <p className="text-xs text-onSurfaceVariant">Access verification dashboard using your credentials.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-primary">Username</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-primary">Password</label>
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-surface border border-outlineVariant rounded-md text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="text-[10px] text-onSurfaceVariant mt-1">Default demo: <strong>admin</strong> / <strong>admin123</strong></p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white hover:bg-primary-light py-2.5 rounded-full font-bold text-xs flex items-center justify-center gap-2 shadow-ambient transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In as Officer'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
