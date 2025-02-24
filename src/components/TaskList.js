import React, { useState, useEffect } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { DragDropContext } from "react-beautiful-dnd";
import { FaUser, FaCalendarAlt, FaFlag } from "react-icons/fa";

import "./TaskList.css";
export default function TaskList() {
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/tasks")
      .then((response) => response.json())
      .then((json) => {
        setTodo(json.filter((task) => task.status === "TODO"));
        setInProgress(json.filter((task) => task.status === "IN_PROGRESS"));
        setDone(json.filter((task) => task.status === "DONE"));
      });
  }, []);

  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const task = findItemById(draggableId, [...todo, ...inProgress, ...done]);
    if (!task) return;

    deletePreviousState(source.droppableId, draggableId);
    setNewState(destination.droppableId, task);
  };

  function deletePreviousState(sourceDroppableId, taskId) {
    switch (sourceDroppableId) {
      case "1":
        setTodo(removeItemById(taskId, todo));
        break;
      case "2":
        setInProgress(removeItemById(taskId, inProgress));
        break;
      case "3":
        setDone(removeItemById(taskId, done));
        break;
    }
  }

  function setNewState(destinationDroppableId, task) {
    let updatedTask;
    switch (destinationDroppableId) {
      case "1":
        updatedTask = { ...task, status: "TODO" };
        setTodo([updatedTask, ...todo]);
        break;
      case "2":
        updatedTask = { ...task, status: "IN_PROGRESS" };
        setInProgress([updatedTask, ...inProgress]);
        break;
      case "3":
        updatedTask = { ...task, status: "DONE" };
        setDone([updatedTask, ...done]);
        break;
    }
    updateTaskInDatabase(updatedTask);
  }

  function updateTaskInDatabase(task) {
    console.log("Updating task in DB:", task);
    fetch(`http://localhost:8080/api/tasks/${task.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    })
      .then((response) => response.json())
      .then((json) => console.log("Response from DB:", json))
      .catch((error) => console.error("Error updating task in DB:", error));
  }

  function findItemById(id, array) {
    return array.find((item) => item.id == id);
  }

  function removeItemById(id, array) {
    return array.filter((item) => item.id != id);
  }

  return (
    <div className="task-list-container">
      <h3>Liste de Taches</h3>
  
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex-container">
          {/* TODO List */}
          <Droppable droppableId="1">
            {(provided) => (
              <div
                className="column list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
      <h6 className="status-title nn">

      <span className="status-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <use href="#cu3-icon-statusIcon" xlinkHref="#cu3-icon-statusIcon"></use>
          </svg>
        </span>
        À Faire

      </h6>


<ul className="task-list">
  {todo.length > 0 ? (
    todo.map((task, index) => (
      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
        {(provided) => (
          <li
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="task-item"
          >
            <span className="task-title">{task.title}</span>
            <span className="task-info">
              <FaUser /> Assigné
            </span>
            <span className="task-info">
              <FaCalendarAlt /> Due Date
            </span>
            <span className={`task-info priority-${task.priority?.toLowerCase()}`}>
              <FaFlag /> Priorité
            </span>
          </li>
        )}
      </Draggable>
    ))
  ) : (
    <p className="empty-message">Aucune tâche</p>
  )}
</ul>

                {provided.placeholder}
              </div>
            )}
          </Droppable>
  
          {/* In Progress List */}
          <Droppable droppableId="2">
            {(provided) => (
              <div
                className="column list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                    <h6 className="status-title nnn">

<span className="status-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <use href="#cu3-icon-statusIcon" xlinkHref="#cu3-icon-statusIcon"></use>
    </svg>
  </span>
  En Cours

</h6>
                <ul className="task-list">
                  {inProgress.length > 0 ? (
                    inProgress.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                            <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-item"
                            >
                            <span className="task-title">{task.title}</span>
                            <span className="task-info">
                                <FaUser /> Assigné
                            </span>
                            <span className="task-info">
                                <FaCalendarAlt /> Due Date
                            </span>
                            <span className={`task-info priority-${task.priority?.toLowerCase()}`}>
                                <FaFlag /> Priorité
                            </span>
                            </li>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p className="empty-message">Aucune tâche en cours</p>
                  )}
                </ul>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
  
          {/* Done List */}
          <Droppable droppableId="3">
            {(provided) => (
              <div
                className="column list"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                    <h6 className="status-title nnnn">

<span className="status-icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <use href="#cu3-icon-statusIcon" xlinkHref="#cu3-icon-statusIcon"></use>
    </svg>
  </span>
  Terminées

</h6>
                <ul className="task-list">
                  {done.length > 0 ? (
                    done.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                        {(provided) => (
                            <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task-item"
                            >
                            <span className="task-title">{task.title}</span>
                            <span className="task-info">
                                <FaUser /> Assigné
                            </span>
                            <span className="task-info">
                                <FaCalendarAlt /> Due Date
                            </span>
                            <span className={`task-info priority-${task.priority?.toLowerCase()}`}>
                                <FaFlag /> Priorité
                            </span>
                            </li>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p className="empty-message">Aucune tâche terminée</p>
                  )}
                </ul>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    </div>
  );
  
}
