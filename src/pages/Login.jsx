import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { loginUser } from '../services/userService';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '../stores/authSlice';
const loginFields = [
  { label: 'Email address', name: 'email', type: 'email', placeholder: 'you@example.com' },
  { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
];

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (data) => {
    setError('');
    setIsSubmitting(true);
    try {
      const response = await loginUser({
        email: data.email,
        password: data.password,
      });
      const payload = response.data?.data;
      if (!payload?.user) {
        throw new Error('Invalid login response');
      }
      if (payload.token) {
        localStorage.setItem('token', payload.token);
      }
      dispatch(login(payload));
      const role = payload.user?.role;
      const st = location.state;
      const redirectTo = st?.redirectTo;
      const hash = st?.hash;

      if (role === 'recruiter') {
        if (redirectTo && hash) {
          navigate({ pathname: redirectTo, hash });
        } else if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-root">
      <div className="auth-panel">
        <div className="auth-deco">
          <div className="auth-deco-inner">
            <div className="auth-brand">
              <span className="auth-brand-mark">*</span>
              <span className="auth-brand-name">Luminary</span>
            </div>
            <div className="auth-deco-headline">
              <h2>Welcome<br />back.</h2>
              <p>Sign in to continue where you left off.</p>
            </div>
            <div className="auth-deco-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>

        <div className="auth-form-col">
          <div className="auth-form-wrapper">
            <div className="auth-heading">
              <h1>Sign in</h1>
              <p>Good to see you again.</p>
            </div>
            {error ? <div className="alert alert-danger">{error}</div> : null}
            <AuthForm fields={loginFields} onSubmit={handleLogin} buttonText={isSubmitting ? 'Signing in...' : 'Sign in'} />
            <p className="auth-forgot">
              <a href="#">Forgot your password?</a>
            </p>
            <p className="auth-switch">
              Don't have an account? <Link to="/signup">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
