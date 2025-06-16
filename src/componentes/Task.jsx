import React, { useState } from 'react';
import './css/Task.css';

const initialColumns = {
  todo: { title: 'To Do', items: [] },
  doing: { title: 'Doing', limit: 5, items: [] },
  done: { title: 'Done', items: [] },
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [newTask, setNewTask] = useState('');

  const handleAdd = () => {
    if (!newTask.trim()) return;
    setColumns(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        items: [...prev.todo.items, { id: Date.now(), text: newTask }],
      },
    }));
    setNewTask('');
  };

  const renderColumn = (key) => {
    const col = columns[key];
    return (
      <div className="kanban-column" key={key}>
        <div className="kanban-header">
          <span>{col.title}</span>
          {key === 'doing' && (
            <span style={{ color: '#4caf50' }}>
              {col.items.length}/{col.limit}
            </span>
          )}
        </div>

        <div className="kanban-body">
          {key === 'todo' && (
            <div className="new-task">
              <input
                type="text"
                placeholder="+ New item"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
              <button onClick={handleAdd}>+</button>
            </div>
          )}
          {col.items.map(item => (
            <div className="kanban-card" key={item.id}>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="kanban-container">
      {Object.keys(columns).map(renderColumn)}
    </div>
  );
};

export default KanbanBoard;
