import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TaskItem from '../TaskItem/TaskItem.js';
import Loader from '../Loader/Loader.js';
import './Tasks.css';

function Tasks({ onLogout, onNavigateToProfile }) {
  const user = useSelector((state) => state.auth.user);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/task/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsAdding(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/task/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          priority: 1,
          complete: false,
        }),
      });
      if (response.ok) {
        // Refetch tasks
        const fetchResponse = await fetch('http://127.0.0.1:8000/task/', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (fetchResponse.ok) {
          const data = await fetchResponse.json();
          setTasks(data);
        }
        setNewTaskTitle('');
        setNewTaskDescription('');
        setIsAdding(false);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateTask = async (id, updatedTask) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/task/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: updatedTask.title,
          description: updatedTask.description,
          priority: task.priority || 1,
          complete: task.complete,
        }),
      });
      if (response.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedTask } : t));
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/task/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleToggleComplete = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/task/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          priority: task.priority || 1,
          complete: !task.complete,
        }),
      });
      if (response.ok) {
        setTasks(tasks.map(t => t.id === id ? { ...t, complete: !t.complete } : t));
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  return (
    <div className='tasks-container'>
      <div className='tasks-wrapper'>
        <div className='tasks-header'>
          <div className='header-left'>
            <h1 className='tasks-title'>My Tasks</h1>
            <p className='tasks-subtitle'>Welcome, {user.name}</p>
          </div>
          <div className='header-right'>
            <button className='btn btn-secondary' onClick={onNavigateToProfile}>Profile</button>
            <button className='btn btn-logout' onClick={onLogout}>Logout</button>
          </div>
        </div>
        <div className='tasks-content'>
          {!isAdding && <button className='btn btn-add' onClick={() => setIsAdding(true)}>+ Add New Task</button>}
          {isAdding && (
            <div className='add-task-form'>
              <form onSubmit={handleAddTask}>
                <div className='form-group'>
                  <input
                    type='text'
                    className='form-input'
                    placeholder='Task title'
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className='form-group'>
                  <textarea
                    className='form-textarea'
                    placeholder='Task description (optional)'
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className='form-actions'>
                  <button type='submit' className='btn btn-primary'>Add Task</button>
                  <button
                    type='button'
                    className='btn btn-cancel'
                    onClick={() => {
                      setIsAdding(false);
                      setNewTaskTitle('');
                      setNewTaskDescription('');
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
          {isLoading && (
            <div className='loader-container'>
              <Loader />
            </div>
          )}
          {!isLoading && tasks.length === 0 && (
            <div className='empty-state'>
              <p>No tasks yet. Create your first task!</p>
            </div>
          )}
          {!isLoading && tasks.length > 0 && (
            <div className='tasks-list'>
              {tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onUpdate={handleUpdateTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Tasks;