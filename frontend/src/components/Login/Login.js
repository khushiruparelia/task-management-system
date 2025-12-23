import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/authSlice.js';
import Loader from '../Loader/Loader.js';
import './Login.css';

function Login({ onLogin, onNavigateToSignup, isLoading }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLocalLoading(true);
    try {
      // Get token
      const tokenResponse = await fetch('http://127.0.0.1:8000/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!tokenResponse.ok) {
        throw new Error('Login failed');
      }

      const tokenData = await tokenResponse.json();
      const token = tokenData.access_token;

      // Store token
      localStorage.setItem('token', token);

      // Get user data
      const userResponse = await fetch('http://127.0.0.1:8000/user/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user data');
      }

      const user = await userResponse.json();

      // Dispatch login with user
      dispatch(login(user));

      // Call onLogin if needed
      if (onLogin) {
        onLogin(user);
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Login failed: ' + error.message);
    } finally {
      setLocalLoading(false);
    }
  };  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Login to manage your tasks</p>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || localLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || localLoading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading || localLoading}
          >
            {isLoading || localLoading ? <Loader /> : 'Login'}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? </p>
          <button
            className="link-button"
            onClick={onNavigateToSignup}
            disabled={isLoading || localLoading}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;