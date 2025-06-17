import React, { useState } from "react";
import "./css/Task.css";
import TaskFormModal from "../ui/TaskFormModal";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const generateId = () =>
  `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const KanbanBoard = () => {
  const [columns, setColumns] = useState({
    todo: { title: "To Do", items: [] },
    doing: { title: "Doing", limit: 5, items: [] },
    done: { title: "Done", items: [] },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleSaveTask = (taskData) => {
    setColumns((prev) => {
      const cols = { ...prev };

      if (selectedTask) {
        const { columnId, id } = selectedTask;
        cols[columnId].items = cols[columnId].items.map((t) =>
          t.id === id ? { ...t, ...taskData, id } : t
        );
      } else {
        const newTask = {
          ...taskData,
          id: generateId(), // 🔐 genera un ID seguro aquí
        };
        cols.todo.items = [...cols.todo.items, newTask];
      }

      return cols;
    });

    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    )
      return;

    const newCols = JSON.parse(JSON.stringify(columns));
    const sourceCol = newCols[source.droppableId];
    const destCol = newCols[destination.droppableId];
    const [moved] = sourceCol.items.splice(source.index, 1);

    if (
      destination.droppableId === "doing" &&
      destCol.items.length >= destCol.limit
    ) {
      alert("Límite alcanzado en Doing");
      return;
    }

    destCol.items.splice(destination.index, 0, moved);
    setColumns(newCols);
  };

  return (
    <div className="kanban-container">
      <DragDropContext onDragEnd={onDragEnd}>
        {Object.entries(columns).map(([columnId, column]) => (
          <Droppable key={columnId} droppableId={columnId}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`kanban-column ${
                  snapshot.isDraggingOver ? "dragging-over" : ""
                }`}
              >
                <div className="kanban-header">
                  <h3>{column.title}</h3>
                  {columnId === "doing" && (
                    <span className="limit-badge">
                      {column.items.length}/{column.limit}
                    </span>
                  )}
                </div>

                <div className="kanban-cards">
                  {columnId === "todo" && (
                    <button
                      className="add-task-btn"
                      onClick={() => {
                        setSelectedTask(null);
                        setIsModalOpen(true);
                      }}
                    >
                      + Nueva tarea
                    </button>
                  )}

                  {column.items.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(prov, snap) => (
                        <div
                          ref={prov.innerRef}
                          {...prov.draggableProps}
                          {...prov.dragHandleProps}
                          className={`kanban-card ${
                            snap.isDragging ? "dragging" : ""
                          }`}
                          onClick={() => {
                            setSelectedTask({ ...item, columnId });
                            setIsModalOpen(true);
                          }}
                        >
                          <h4>{item.title}</h4>
                          {item.description && <p>{item.description}</p>}
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>

      <TaskFormModal
        isOpen={isModalOpen}
        initialData={selectedTask || {}}
        onClose={() => {
          setSelectedTask(null);
          setIsModalOpen(false);
        }}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default KanbanBoard;
