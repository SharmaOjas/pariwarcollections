import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContextBase';
import axios from 'axios';
import { toast } from 'react-toastify';
// Optional icons for better UI
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, Loader2 } from 'lucide-react'; 

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  // Form State
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  
  // UX State
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      if (currentState === 'Sign Up') {
        if (!emailVerified) {
          toast.error('Please verify your email via OTP first.');
          setLoading(false);
          return;
        }

        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Account created successfully!");
        } else {
          toast.error(response.data.message);
        }
      } else {
        // Login Logic
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          toast.success("Welcome back!");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async () => {
    if (!email) {
      toast.error('Please enter your email address first.');
      return;
    }
    setLoading(true);
    try {
      const r = await axios.post(backendUrl + '/api/user/send-otp', { email });
      if (r.data.success) {
        setOtpSent(true);
        setEmailVerified(false);
        toast.success('OTP code sent to your email.');
      } else {
        toast.error(r.data.message || 'Unable to send OTP');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otpCode) {
      toast.error('Please enter the OTP code.');
      return;
    }
    setLoading(true);
    try {
      const r = await axios.post(backendUrl + '/api/user/verify-otp', { email, code: otpCode });
      if (r.data.success) {
        setEmailVerified(true);
        setOtpSent(false); // Hide OTP field after success to clean up UI
        toast.success('Email verified successfully!');
      } else {
        toast.error(r.data.message || 'Invalid OTP');
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  // Reset verification state when switching modes
  const switchState = (state) => {
    setCurrentState(state);
    setOtpSent(false);
    setEmailVerified(false);
    setOtpCode('');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50/50">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8 border border-gray-100">
        
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <h1 className="prata-regular text-3xl font-serif text-gray-900">{currentState}</h1>
          <div className="h-1 w-12 bg-gray-800 rounded-full"></div>
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-5">
          
          {/* Name Input (Sign Up Only) */}
          {currentState === 'Sign Up' && (
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-gray-800 transition-colors" />
              </div>
              <input 
                onChange={(e) => setName(e.target.value)} 
                value={name} 
                type="text" 
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all" 
                placeholder="Full Name" 
                required 
              />
            </div>
          )}

          {/* Email Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-800 transition-colors" />
            </div>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              type="email" 
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all ${emailVerified ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
              placeholder="Email Address" 
              required 
              disabled={emailVerified} // Lock email after verification
            />
            {emailVerified && (
               <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                 <CheckCircle className="h-5 w-5 text-green-600" />
               </div>
            )}
          </div>

          {/* OTP Section (Sign Up Only) */}
          {currentState === 'Sign Up' && !emailVerified && (
            <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Email Verification</span>
                {!otpSent && (
                   <button 
                     type="button" 
                     onClick={sendOtp} 
                     disabled={loading}
                     className="text-xs font-medium text-gray-800 underline hover:text-black disabled:opacity-50"
                   >
                     {loading ? 'Sending...' : 'Send OTP'}
                   </button>
                )}
              </div>
              
              {otpSent && (
                <div className="flex gap-2">
                  <input 
                    value={otpCode} 
                    onChange={(e) => setOtpCode(e.target.value)} 
                    type="text" 
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:border-gray-800 outline-none" 
                    placeholder="Enter 6-digit code"
                  />
                  <button 
                    type="button" 
                    onClick={verifyOtp} 
                    disabled={loading}
                    className="bg-gray-800 text-white text-xs px-4 py-2 rounded hover:bg-gray-700 transition-colors disabled:opacity-70"
                  >
                    {loading ? '...' : 'Verify'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-800 transition-colors" />
            </div>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              type={showPassword ? "text" : "password"} 
              className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all" 
              placeholder="Password" 
              required 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Forgot Password / Switch Link */}
          <div className="flex justify-between text-sm mt-1">
            <p className="text-gray-500 cursor-pointer hover:text-gray-800 transition-colors">Forgot password?</p>
            {currentState === 'Login' 
              ? <p onClick={() => switchState('Sign Up')} className="text-gray-800 font-medium cursor-pointer hover:underline">Create account</p>
              : <p onClick={() => switchState('Login')} className="text-gray-800 font-medium cursor-pointer hover:underline">Login Here</p>
            }
          </div>

          {/* Submit Button */}
          <button 
            disabled={loading}
            className="w-full bg-gray-900 text-white font-light py-3 rounded-lg mt-2 hover:bg-gray-800 transition-transform active:scale-[0.98] disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;