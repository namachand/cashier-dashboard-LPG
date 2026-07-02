import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  identifyAuthMethod,
  loginWithPassword,
  requestOtp,
  verifyOtp,
} from '../services/authApi';

const AUTH_TOKEN_KEY = 'cashier_auth_token';
const AUTH_USER_KEY = 'cashier_auth_user';

export default function Login() {
  const navigate = useNavigate();

  const [step, setStep] = useState('IDENTIFIER');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [masked, setMasked] = useState('');
  const [passwordAvailable, setPasswordAvailable] = useState(false);
  const [otpAvailable, setOtpAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    const userRaw = localStorage.getItem(AUTH_USER_KEY);

    if (!token || !userRaw) return;

    try {
      const user = JSON.parse(userRaw);
      if (user?.role === 'CASHIER') {
        navigate('/', { replace: true });
      }
    } catch (err) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }, [navigate]);

  const persistSession = (token, user) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    navigate('/');
  };

  const handleIdentify = async () => {
    setError('');
    if (!identifier.trim()) {
      setError('Enter email or phone number');
      return;
    }

    try {
      setLoading(true);
      const res = await identifyAuthMethod(identifier.trim());
      setMasked(res.data?.masked || '');
      setPasswordAvailable(Boolean(res.data?.availableMethods?.password));
      setOtpAvailable(Boolean(res.data?.availableMethods?.otp));
      setStep('METHOD');
    } catch (err) {
      setError(err.message || 'Unable to identify user');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    setError('');
    if (!password.trim()) {
      setError('Enter password');
      return;
    }

    try {
      setLoading(true);
      const res = await loginWithPassword(identifier.trim(), password);

      if (res?.user?.role !== 'CASHIER') {
        setError('Only CASHIER users can login to this dashboard');
        return;
      }

      persistSession(res.token, res.user);
    } catch (err) {
      setError(err.message || 'Unable to login with password');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setError('');
    try {
      setLoading(true);
      await requestOtp(identifier.trim());
      setStep('OTP');
    } catch (err) {
      setError(err.message || 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setError('');
    if (!otp.trim()) {
      setError('Enter OTP');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp(identifier.trim(), otp.trim());

      if (res?.user?.role !== 'CASHIER') {
        setError('Only CASHIER users can login to this dashboard');
        return;
      }

      persistSession(res.token, res.user);
    } catch (err) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Cashier Login</h1>
        <p>Use email/phone, then password or OTP</p>

        <label>Email or Phone</label>
        <input
          type="text"
          value={identifier}
          disabled={step !== 'IDENTIFIER'}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="Enter email or phone"
        />

        {step === 'IDENTIFIER' && (
          <button type="button" onClick={handleIdentify} disabled={loading}>
            {loading ? 'Please wait...' : 'Continue'}
          </button>
        )}

        {step === 'METHOD' && (
          <div className="login-methods">
            <p>Authenticate as {masked || 'user'}</p>
            {passwordAvailable && (
              <button type="button" onClick={() => setStep('PASSWORD')}>
                Login with Password
              </button>
            )}
            {otpAvailable && (
              <button type="button" onClick={handleRequestOtp} disabled={loading}>
                {loading ? 'Sending...' : 'Login with OTP'}
              </button>
            )}
          </div>
        )}

        {step === 'PASSWORD' && (
          <>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
            <button type="button" onClick={handlePasswordLogin} disabled={loading}>
              {loading ? 'Please wait...' : 'Login'}
            </button>
            <button type="button" className="ghost-btn" onClick={() => setStep('METHOD')}>
              Back
            </button>
          </>
        )}

        {step === 'OTP' && (
          <>
            <label>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
            />
            <button type="button" onClick={handleVerifyOtp} disabled={loading}>
              {loading ? 'Please wait...' : 'Verify OTP'}
            </button>
            <button type="button" className="ghost-btn" onClick={handleRequestOtp}>
              Resend OTP
            </button>
          </>
        )}

        {error && <div className="error-box">{error}</div>}
      </div>
    </div>
  );
}
