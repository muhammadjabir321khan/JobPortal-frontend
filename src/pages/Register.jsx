import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../services/userService';

const signupFields = [
  { label: 'Full name', name: 'name', type: 'text', placeholder: 'Jane Doe' },
  { label: 'Email address', name: 'email', type: 'email', placeholder: 'you@example.com' },
  { label: 'Password', name: 'password', type: 'password', placeholder: 'Password' },
  { label: 'Confirm password', name: 'confirm', type: 'password', placeholder: 'Confirm password' },
  { label: 'Profile Image', name: 'avatar', type: 'file' },
  {
    label: 'Login As',
    name: 'role',
    type: 'radio',
    options: [
      { label: 'Student', value: 'student' },
      { label: 'Recruiter', value: 'recruiter' },
    ],
  },
];

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async (data) => {
    setError('');
    setSuccess('');

    if (data.password !== data.confirm) {
      setError('Passwords do not match.');
      return;
    }

    if (!(data.avatar instanceof File) || data.avatar.size === 0) {
      setError('Profile image is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        avatar: data.avatar,
      });

      setSuccess('Account created successfully. Please sign in.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              <h2>Start your<br />journey.</h2>
              <p>Join thousands of creators building the future.</p>
            </div>
            <div className="auth-deco-dots">
              <span /><span /><span />
            </div>
          </div>
        </div>
        <div className="auth-form-col">
          <div className="auth-form-wrapper">
            <div className="auth-heading">
              <h1>Create account</h1>
              <p>It's free and takes less than a minute.</p>
            </div>
            {error ? <div className="alert alert-danger">{error}</div> : null}
            {success ? <div className="alert alert-success">{success}</div> : null}
            <AuthForm fields={signupFields} onSubmit={handleSignup} buttonText={isSubmitting ? 'Creating account...' : 'Create account'} />
            <p className="auth-switch">
              Already have an account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
