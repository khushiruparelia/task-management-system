import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { login, logout } from './redux/authSlice.js';
import Login from './components/Login/Login.js';
import Signup from './components/Signup/Signup.js';
import Tasks from './components/Tasks/Tasks.js';
import Profile from './components/Profile/Profile.js';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Get user state from Redux
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      dispatch(login(userData));
      navigate('/tasks');
    }
  }, [dispatch, navigate]);

  const handleLogin = async (email, password) => {
    setIsLoading(true);
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = storedUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const userObj = { email: foundUser.email, name: foundUser.name };
        dispatch(login(userObj));
        localStorage.setItem('user', JSON.stringify(userObj));
        navigate('/tasks');
      } else {
        alert('Invalid credentials');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleSignup = async (name, email, password) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = storedUsers.find(u => u.email === email);
      
      if (existingUser) {
        alert('Email already exists');
        setIsLoading(false);
        return;
      }
      
      const newUser = { name, email, password };
      storedUsers.push(newUser);
      localStorage.setItem('users', JSON.stringify(storedUsers));
      
      const userObj = { email, name };
      dispatch(login(userObj));
      localStorage.setItem('user', JSON.stringify(userObj));
      navigate('/tasks');
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileUpdate = async (name, password) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = storedUsers.findIndex(u => u.email === user.email);
      
      if (userIndex !== -1) {
        storedUsers[userIndex].name = name;
        if (password) {
          storedUsers[userIndex].password = password;
        }
        localStorage.setItem('users', JSON.stringify(storedUsers));
        
        const updatedUser = { email: user.email, name };
        dispatch(login(updatedUser));
        localStorage.setItem('user', JSON.stringify(updatedUser));
        alert('Profile updated successfully');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
      <div className='app'>
        <Routes>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/tasks" /> : <Login onLogin={handleLogin} onNavigateToSignup={() => navigate('/signup')} isLoading={isLoading} />} />
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/tasks" /> : <Signup onSignup={handleSignup} onNavigateToLogin={() => navigate('/login')} isLoading={isLoading} />} />
          <Route path="/tasks" element={isLoggedIn ? <Tasks user={user} onLogout={handleLogout} onNavigateToProfile={() => navigate('/profile')} /> : <Navigate to="/login" />} />
          <Route path="/profile" element={isLoggedIn ? <Profile user={user} onProfileUpdate={handleProfileUpdate} onNavigateToTasks={() => navigate('/tasks')} isLoading={isLoading} /> : <Navigate to="/login" />} />
          <Route path="/" element={<Navigate to={isLoggedIn ? "/tasks" : "/login"} />} />
        </Routes>
      </div>
  );
}

export default App;