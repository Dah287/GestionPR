import React, { useState, useEffect } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { DragDropContext } from "react-beautiful-dnd";
import { FaUser, FaCalendarAlt, FaFlag } from "react-icons/fa";
import { useParams } from "react-router-dom";
import "./TaskList.css";
export default function TaskList() {
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);
  //const { id } = useParams();

  const projetId = localStorage.getItem("selectedProjet");
  useEffect(() => {
    fetch(`http://localhost:8080/projets/${projetId}/taches`) // Charge les tâches du projet
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [task, setTask] = useState({
    title: '',
    userId: '',
    status: 'TODO', // Par exemple
    projet: { id: '' }, // Projet sous forme d'objet avec un champ id
  });
  
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'projetId') {
      setTask({
        ...task,
        projet: { id: value }, // Mise à jour de l'objet projet avec le champ id
      });
    } else {
      setTask({
        ...task,
        [name]: value,
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const projetId = localStorage.getItem("selectedProjet"); // Récupération du projet ID
    if (!projetId) {
      alert("Projet non sélectionné !");
      return;
    }
  
    const newTask = {
      ...task,
      projet: {
        id: parseInt(projetId), // Associer la tâche au projet sous forme d'objet
      },
    };
  
    try {
      const response = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
  
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout de la tâche");
      }
  
      const savedTask = await response.json();
      console.log("Tâche enregistrée :", savedTask);
  
      // Mise à jour de l'état local en fonction du statut
      switch (savedTask.status) {
        case "TODO":
          setTodo([...todo, savedTask]);
          break;
        case "IN_PROGRESS":
          setInProgress([...inProgress, savedTask]);
          break;
        case "DONE":
          setDone([...done, savedTask]);
          break;
        default:
          break;
      }
  
      setIsModalOpen(false); // Fermer la modal après succès
      setTask({ title: "", userId: "", status: "TODO", projet: { id: "" } }); // Réinitialiser le formulaire
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de l'ajout de la tâche.");
    }
  };
  
  

  return (
    <div className="task-list-container">
      {/* Conteneur du titre et du bouton sur la même ligne */}
      <div className="vc">
        <h3>Liste de Taches</h3>
        <button onClick={handleOpenModal} className="add-task-btn">
          Ajouter une tâche
        </button>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>Créer ou Modifier une Tâche</h4>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Titre</label>
                <input
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Utilisateur ID</label>
                <input
                  type="number"
                  name="userId"
                  value={task.userId}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label>Statut</label>
                <select
                  name="status"
                  value={task.status}
                  onChange={handleInputChange}
                >
                  <option value="TODO">À faire</option>
                  <option value="IN_PROGRESS">En cours</option>
                  <option value="DONE">Terminé</option>
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit">Enregistrer</button>
                <button type="button" onClick={handleCloseModal}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
