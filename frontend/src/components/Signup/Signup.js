import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader.js';
import './Signup.css';

function Signup({ onSignup, onNavigateToLogin, isLoading }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localLoading, setLocalLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert('Please fill in all fields');
      return;
    }

    setLocalLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, name, password }),
      });

      if (response.ok) {
        alert('Signup successful! Please login.');
        navigate('/login');
      } else {
        const errorData = await response.json();
        alert('Signup failed: ' + (errorData.detail || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during signup');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className='signup-container'>
      <div className='signup-card'>
        <h1 className='signup-title'>Create Account</h1>
        <p className='signup-subtitle'>Sign up to start managing tasks</p>
        <form className='signup-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              id='name'
              className='form-input'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading || localLoading}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input
              type='email'
              id='email'
              className='form-input'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading || localLoading}
            />
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              className='form-input'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading || localLoading}
            />
          </div>
          <button
            type='submit'
            className='btn btn-primary'
            disabled={isLoading || localLoading}
          >
            {isLoading || localLoading ? <Loader /> : 'Sign Up'}
          </button>
        </form>
        <div className='signup-footer'>
          <p>Already have an account? </p>
          <button
            className='link-button'
            onClick={onNavigateToLogin}
            disabled={isLoading || localLoading}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signup;