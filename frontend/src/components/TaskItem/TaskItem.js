import React, { useState } from 'react';
import './TaskItem.css';

function TaskItem({ task, onUpdate, onDelete, onToggleComplete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const handleUpdate = () => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle,
        description: editDescription
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  if (isEditing) {
    return (
      <div className='task-item editing'>
        <div className='form-group'>
          <input
            type='text'
            className='form-input'
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder='Task title'
            autoFocus
          />
        </div>
        <div className='form-group'>
          <textarea
            className='form-textarea'
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder='Task description'
            rows={3}
          />
        </div>
        <div className='task-actions'>
          <button
            className='btn-small btn-save'
            onClick={handleUpdate}
          >
            Save
          </button>
          <button
            className='btn-small btn-cancel-edit'
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className='task-checkbox'>
        <input
          type='checkbox'
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
          className='checkbox-input'
        />
      </div>
      <div className='task-content'>
        <h3 className='task-title'>{task.title}</h3>
        {task.description && <p className='task-description'>{task.description}</p>}
        <p className='task-date'>Created: {new Date(task.createdAt).toLocaleDateString()}</p>
      </div>
      <div className='task-actions'>
        <button
          className='btn-icon btn-edit'
          onClick={() => setIsEditing(true)}
          title='Edit task'
        >
          ✏️
        </button>
        <button
          className='btn-icon btn-delete'
          onClick={handleDelete}
          title='Delete task'
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default TaskItem;