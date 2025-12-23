import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '../Loader/Loader.js';
import './Profile.css';

function Profile({ onProfileUpdate, onNavigateToTasks, isLoading }) {
  const user = useSelector((state) => state.auth.user);
  const [name, setName] = useState(user.name);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Name cannot be empty');
      return;
    }

    if (password && password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    onProfileUpdate(name, password);
  };

  return (
    <div className='profile-container'>
      <div className='profile-card'>
        <div className='profile-header'>
          <button className='btn-back' onClick={onNavigateToTasks}>← Back to Tasks</button>
          <h1 className='profile-title'>Profile Settings</h1>
        </div>
        <div className='profile-info'>
          <div className='info-item'>
            <label>Email (cannot be changed)</label>
            <p className='email-display'>{user.email}</p>
          </div>
        </div>
        <form className='profile-form' onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              id='name'
              className='form-input'
              placeholder='Enter your name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className='password-section'>
            <h3 className='section-title'>Change Password (optional)</h3>
            <div className='form-group'>
              <label htmlFor='password'>New Password</label>
              <input
                type='password'
                id='password'
                className='form-input'
                placeholder='Enter new password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='confirmPassword'>Confirm New Password</label>
              <input
                type='password'
                id='confirmPassword'
                className='form-input'
                placeholder='Confirm new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <div className='form-actions'>
            <button
              type='submit'
              className='btn btn-primary'
              disabled={isLoading}
            >
              {isLoading ? <Loader /> : 'Update Profile'}
            </button>
            <button
              type='button'
              className='btn btn-cancel'
              onClick={onNavigateToTasks}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;