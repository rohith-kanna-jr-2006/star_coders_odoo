import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await login(email, password);
      auth.login(response.data.token, response.data.user);
      
      if (response.data.user.role === 'admin' || response.data.user.role === 'hr') {
        navigate('/admin/dashboard');
      } else {
        navigate('/employee/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return React.createElement(
    'div',
    { className: 'login-container' },
    React.createElement(
      'div',
      { className: 'login-card' },
      React.createElement('h2', null, 'DAYFLOW HRMS'),
      React.createElement('p', null, 'Login to your account'),
      
      error ? React.createElement('div', { className: 'alert alert-error' }, error) : null,
      
      React.createElement(
        'form',
        { onSubmit: handleLogin },
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', null, 'Email'),
          React.createElement('input', {
            type: 'email',
            value: email,
            onChange: (e) => setEmail(e.target.value),
            required: true
          })
        ),
        React.createElement(
          'div',
          { className: 'form-group' },
          React.createElement('label', null, 'Password'),
          React.createElement('input', {
            type: 'password',
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true
          })
        ),
        React.createElement(
          'button',
          { type: 'submit', className: 'btn btn-primary btn-block', disabled: loading },
          loading ? 'Logging in...' : 'Login'
        )
      ),
      React.createElement(
        'div',
        { className: 'login-hint' },
        'Hint: admin@dayflow.com / admin123'
      )
    )
  );
};

export default Login;
