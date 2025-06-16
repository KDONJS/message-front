// TaskFormModal.jsx
import React, { useState } from 'react';
import './css/TaskModal.css';

const TaskFormModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('2');
  const [effort, setEffort] = useState('');

  const handleSave = () => {
    if (!title.trim()) return alert("El campo 'Título' es obligatorio");
    onSave({ id: Date.now(), title, description, priority, effort });
    onClose();
    setTitle('');
    setDescription('');
    setPriority('2');
    setEffort('');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Crear nueva tarea</h2>
        <label>Título *</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        <label>Prioridad</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="1">Alta</option>
          <option value="2">Media</option>
          <option value="3">Baja</option>
        </select>

        <label>Esfuerzo</label>
        <input value={effort} onChange={(e) => setEffort(e.target.value)} type="number" />

        <div className="modal-actions">
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
