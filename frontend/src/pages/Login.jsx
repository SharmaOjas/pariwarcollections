import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContextBase';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name,setName] = useState('')
  const [password,setPasword] = useState('')
  const [email,setEmail] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [emailVerified, setEmailVerified] = useState(false)

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        if (currentState === 'Sign Up') {
          if (!emailVerified) {
            toast.error('Please verify your email via OTP')
            return
          }
          
          const response = await axios.post(backendUrl + '/api/user/register',{name,email,password})
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token',response.data.token)
          } else {
            toast.error(response.data.message)
          }

        } else {

          const response = await axios.post(backendUrl + '/api/user/login', {email,password})
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token',response.data.token)
          } else {
            toast.error(response.data.message)
          }

        }


      } catch (error) {
        toast.error(error.response?.data?.message || 'An error occurred. Please try again.')
      }
  }

  const sendOtp = async () => {
    try {
      if (!email) {
        toast.error('Enter email first')
        return
      }
      const r = await axios.post(backendUrl + '/api/user/send-otp', { email })
      if (r.data.success) {
        setOtpSent(true)
        setEmailVerified(false)
        toast.success('OTP sent to your email')
      } else {
        toast.error(r.data.message || 'Unable to send OTP')
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Unable to send OTP')
    }
  }

  const verifyOtp = async () => {
    try {
      if (!otpCode) {
        toast.error('Enter OTP code')
        return
      }
      const r = await axios.post(backendUrl + '/api/user/verify-otp', { email, code: otpCode })
      if (r.data.success) {
        setEmailVerified(true)
        toast.success('Email verified')
      } else {
        toast.error(r.data.message || 'Invalid OTP')
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Invalid OTP')
    }
  }

  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token, navigate])

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
        <div className='inline-flex items-center gap-2 mb-2 mt-10'>
            <p className='prata-regular text-3xl'>{currentState}</p>
            <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>
        {currentState === 'Login' ? '' : <input onChange={(e)=>setName(e.target.value)} value={name} type="text" className='w-full px-3 py-2 border border-gray-800' placeholder='Name' required/>}
        <input onChange={(e)=>setEmail(e.target.value)} value={email} type="email" className='w-full px-3 py-2 border border-gray-800' placeholder='Email' required/>
        {currentState === 'Sign Up' && (
          <>
            <div className='w-full flex items-center gap-2'>
              <button type='button' onClick={sendOtp} className='border px-3 py-2 rounded text-sm'>
                {otpSent ? 'Resend OTP' : 'Send OTP'}
              </button>
              <p className={`text-xs ${emailVerified ? 'text-green-600' : 'text-gray-500'}`}>
                {emailVerified ? 'Verified' : 'Not verified'}
              </p>
            </div>
            {otpSent && !emailVerified && (
              <div className='w-full flex items-center gap-2'>
                <input value={otpCode} onChange={(e)=>setOtpCode(e.target.value)} type="text" className='flex-1 px-3 py-2 border border-gray-800' placeholder='Enter OTP'/>
                <button type='button' onClick={verifyOtp} className='border px-3 py-2 rounded text-sm'>Verify</button>
              </div>
            )}
          </>
        )}
        <input onChange={(e)=>setPasword(e.target.value)} value={password} type="password" className='w-full px-3 py-2 border border-gray-800' placeholder='Password' required/>
        <div className='w-full flex justify-between text-sm mt-[-8px]'>
            <p className=' cursor-pointer'>Forgot your password?</p>
            {
              currentState === 'Login' 
              ? <p onClick={()=>setCurrentState('Sign Up')} className=' cursor-pointer'>Create account</p>
              : <p onClick={()=>setCurrentState('Login')} className=' cursor-pointer'>Login Here</p>
            }
        </div>
        <button className='bg-black text-white font-light px-8 py-2 mt-4'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
    </form>
  )
}

export default Login
