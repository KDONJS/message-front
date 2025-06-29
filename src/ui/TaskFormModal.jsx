import React, { useState, useEffect } from "react";
import "../componentes/css/TaskModal.css";

const TaskFormModal = ({ isOpen, onClose, onSave, initialData = {} }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("2");
  const [effort, setEffort] = useState("");
  const [hasSaved, setHasSaved] = useState(false); // ⚠️ Prevención de doble guardado

  useEffect(() => {
    setTitle(initialData.title || "");
    setDescription(initialData.description || "");
    setPriority(initialData.priority || "2");
    setEffort(initialData.effort || "");
    setHasSaved(false); // 🔁 Reset al abrir el modal
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (hasSaved) return;
    if (!title.trim()) return alert("El campo 'Título' es obligatorio");

    setHasSaved(true);

    onSave({
      ...(initialData.id ? { id: initialData.id } : {}),
      title,
      description,
      priority,
      effort,
    });

    onClose();
    setTitle("");
    setDescription("");
    setPriority("2");
    setEffort("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{initialData.id ? "Editar tarea" : "Crear nueva tarea"}</h2>
        </div>

        <div className="modal-body">
          <div className="left-panel">
            <div className="form-section">
              <label>Título *</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Agregar título"
              />
            </div>

            <div className="form-section">
              <label>Descripción</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Descripción detallada"
              />
            </div>

            <div className="form-section">
              <label>Comentarios</label>
              <textarea
                placeholder="Agrega comentarios o menciona a alguien"
                rows={3}
              />
            </div>
          </div>

          <div className="right-panel">
            <div className="form-section">
              <h4>Planning</h4>
              <label>Prioridad</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="1">Alta</option>
                <option value="2">Media</option>
                <option value="3">Baja</option>
              </select>

              <label>Esfuerzo</label>
              <input
                type="number"
                value={effort}
                onChange={(e) => setEffort(e.target.value)}
                placeholder="Ej. 5"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" onClick={handleSave}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskFormModal;
