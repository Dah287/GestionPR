import React, { useState, useEffect } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { DragDropContext } from "react-beautiful-dnd";
import { FaUser, FaCalendarAlt, FaFlag } from "react-icons/fa";
import { useParams } from "react-router-dom";
import "./TaskList.css";
export default function TaskListFiltre() {
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [done, setDone] = useState([]);
  //const { id } = useParams();

  const [utilisateurs, setUtilisateurs] = useState([]);
  const [projets, setProjets] = useState([]);  

 // const projetId = localStorage.getItem("selectedProjet");

 const idUtilisateur = localStorage.getItem("id_utilisateur");
  const [selectedProjet, setSelectedProjet] = useState();

  // Charger la liste des projets
  useEffect(() => {
    const fetchProjets = async () => {
      try {
      const token = localStorage.getItem("token"); // récupération du token

      const response = await fetch(`http://localhost:8081/projets/responsable/${idUtilisateur}`, {
        headers: {
          "Authorization": `Bearer ${token}`, // ajout du token
        },
      });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();
        setProjets(data);
        console.log("Données reçues:", data); // Ici data est correct
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    fetchProjets();
  }, []);


  // Ajoutez un useEffect séparé pour surveiller les changements de 'projets'
useEffect(() => {
    console.log("État projets mis à jour:", projets); // Maintenant vous verrez les données
  }, [projets]); // Déclenché chaque fois que 'projets' change
  // Charger les utilisateurs
  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8081/utilisateurs", {
        headers: {
          "Authorization": `Bearer ${token}`, // ajout du token
        },
      });
        if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
        const data = await response.json();
        setUtilisateurs(data);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      }
    };
    fetchUtilisateurs();
  }, []);

  // Charger les tâches quand le projet sélectionné change
  useEffect(() => {
    const fetchTaches = async () => {
      if (!selectedProjet) return;
      
      try {
      const token = localStorage.getItem("token");

      console.log("Fetching tasks for project:", selectedProjet);

      const response = await fetch(`http://localhost:8081/projets/${selectedProjet}/taches`, {
        headers: {
          "Authorization": `Bearer ${token}`, // ajout du token
        },
      });
        
        // Debug: Vérifiez la réponse complète
        console.log("Full response:", {
          status: response.status,
          ok: response.ok,
          headers: [...response.headers.entries()],
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erreur HTTP ${response.status}: ${errorText}`);
        }
  
        // Deux méthodes pour gérer les réponses vides
        const responseText = await response.text();
        const json = responseText ? JSON.parse(responseText) : [];
        
        console.log("Tasks data:", json);
        
        // Mise à jour des états
        setTodo(json.filter((task) => task.status === "TODO"));
        setInProgress(json.filter((task) => task.status === "IN_PROGRESS"));
        setDone(json.filter((task) => task.status === "DONE"));
        
        // Sauvegarde dans localStorage
        localStorage.setItem("selectedProjet", selectedProjet);
      } catch (error) {
        console.error("Erreur complète:", error);
        // Réinitialiser les tâches en cas d'erreur
        setTodo([]);
        setInProgress([]);
        setDone([]);
      }
    };
  
    fetchTaches();
  }, [selectedProjet]); // Déclenché seulement quand selectedProjet change
  const handleProjetChange = (e) => {
    setSelectedProjet(e.target.value);
    console.log("id selectionne ",selectedProjet)
  };




useEffect(() => {
  const fetchProjets = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8081/projets/responsable/${idUtilisateur}`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
      const data = await response.json();
      setProjets(data);

      console.log("Données reçues:", data);

      // 👉 Auto-sélection si un seul projet
      if (data.length === 1) {
        setSelectedProjet(data[0].id);
        localStorage.setItem("selectedProjet", data[0].id);
      }

    } catch (error) {
      console.error("Erreur:", error);
    }
  };
  fetchProjets();
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
  // Récupérer le token du localStorage
  const token = localStorage.getItem("token");

  fetch(`http://localhost:8081/api/tasks/${task.id}`, {
    method: "PUT",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}` // Ajout du token
    },
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

  const [isModalOpenn, setIsModalOpenn] = useState(false);
  const [task, setTask] = useState({
    title: '',
    status: 'TODO', // Statut par défaut
    dueDate: '', // Date d'échéance de la tâche
    priority: '', // Priorité de la tâche
    utilisateur: { id: ''}, // Assigner un utilisateur
    projet: { id: '' }, // Associer à un projet
});
// update task
const [selectedTask, setSelectedTask] = useState({
  title: '',
 // Statut par défaut
  dueDate: '', // Date d'échéance de la tâche
  priority: '', // Priorité de la tâche
  utilisateur: { id: ''}, // Assigner un utilisateur

});

const handleTaskDoubleClick = (task) => {
  setSelectedTask(task);
  setIsModalOpenn(true);
};

const handleCloseModal2 = () => {
  setIsModalOpenn(false);
  setSelectedTask(null);
};

const handleInputChange2 = (e) => {
  const { name, value } = e.target;
  
if (name === 'utilisateur2') {
    // Mise à jour de l'utilisateur assigné
    setSelectedTask({
      ...selectedTask,
      utilisateur: { id: value }, // Stocke seulement l'ID de l'utilisateur
    });
  } else {
    // Mise à jour des autres champs directement
    setSelectedTask({
      ...selectedTask,
      [name]: value,
    });
  }
};
const handleSubmit2 = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token"); // Récupère ton JWT

    const response = await fetch(
      `http://localhost:8081/api/tasks/tache/${selectedTask.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Ajout du token
        },
        body: JSON.stringify(selectedTask),
      }
    );
    if (!response.ok) throw new Error("Erreur lors de la modification de la tâche");
    setIsModalOpenn(false);
    window.location.reload();
  } catch (error) {
    console.error("Erreur :", error);
  }
};

  
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
        projet: { id: value }, // Mise à jour du projet
      });
    } else if (name === 'utilisateur') {
      // Mise à jour de l'utilisateur assigné
      setTask({
        ...task,
        utilisateur: { id: value }, // Stocke seulement l'ID de l'utilisateur
      });
    } else {
      // Mise à jour des autres champs directement
      setTask({
        ...task,
        [name]: value,
      });
    }
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const projetId = localStorage.getItem("selectedProjet");
    if (!projetId) {
      alert("Projet non sélectionné !");
      return;
    }
  
    const newTask = {
      ...task,
      projet: {
        id: parseInt(projetId),
      },
    };
  
    console.log("new task :", newTask);
  
    try {
 const token = localStorage.getItem("token"); // Récupère ton JWT

    const response = await fetch(`http://localhost:8081/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Ajout du token
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

      window.location.reload(); // Cela va recharger la page
    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue lors de l'ajout de la tâche.");
    }
  };
  
  
  const userId = localStorage.getItem("id_utilisateur");
  if (!userId) {
    return null;
  }

  return (
    <div className="task-list-container">
      {/* Conteneur du titre et du bouton sur la même ligne */}
      <div className="vc">
        <h3>Liste de Taches</h3>
        <div className="projet-selector-container">
  <label htmlFor="projet-select" className="projet-selector-label">
    Sélectionnez un projet
  </label>
  <div className="projet-selector-wrapper">
    <select
      id="projet-select"
      value={selectedProjet}
      onChange={handleProjetChange}
      className="projet-selector"
    >
      <option value="" disabled hidden>
        Choisir un projet...
      </option>
      {projets.map((projet) => (
        <option key={projet.id} value={projet.id} className="projet-option">
          📁 {projet.name}
        </option>
      ))}
    </select>
    <div className="projet-selector-arrow">
      <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
        <path d="M1 1L6 6L11 1" stroke="#4A5568" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  </div>
</div>
        <button onClick={handleOpenModal} className="add-task-btn">
          Ajouter une tâche
        </button>
      </div>

         {/* Separator */}
    <hr className="projects-separator" />
        {/* Ajouter Tache */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h4>Crée une Tâche</h4>
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
              <div className="input-container">
              <label className="input-label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={task.dueDate}
                onChange={handleInputChange}
                required
                className="input-field due-date"
              />
            </div>

            <div>
                <label> Priority </label>
                <select
                  name="priority"
                  value={task.priority}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionner une priorité</option>
                  <option value="Low">Faible</option>
                  <option value="Medium">Moyen</option>
                  <option value="HIGH">HAUT</option>
                </select>
              </div>
              <div>
      <label>Assigné</label>
      <select
        name="utilisateur"
        value={task.utilisateur ? task.utilisateur.id : ""}
        onChange={handleInputChange}
      >
        <option value="">Sélectionner un utilisateur</option>
        {utilisateurs.map((utilisateur) => (
          <option key={utilisateur.id} value={utilisateur.id}>
            {utilisateur.nom} {/* Adaptez selon les champs de votre API */}
          </option>
        ))}
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
              {/* Modifier Tache */}
              {isModalOpenn && selectedTask &&(
        <div className="modal">
          <div className="modal-content">
            <h4>Modifier une Tâche</h4>
            <form onSubmit={handleSubmit2}>
              <div>
                <label>Titre</label>
                <input
                  type="text"
                  name="title"
                  value={selectedTask.title}
                  onChange={handleInputChange2}
                  required
                />
              </div>
              <div className="input-container">
              <label className="input-label">Due Date</label>
              <input
                type="date"
                name="dueDate"
                value={selectedTask.dueDate}
                onChange={handleInputChange2}
                required
                className="input-field due-date"
              />
            </div>

            <div>
                <label> Priority </label>
                <select
                  name="priority"
                  value={selectedTask.priority}
                  onChange={handleInputChange2}
                >
                  <option value="">Sélectionner une priorité</option>
                  <option value="Low">Faible</option>
                  <option value="Medium">Moyen</option>
                  <option value="HIGH">HAUT</option>
                </select>
              </div>
              <div>
                <label>Assigné</label>
                <select
                  name="utilisateur2"
                  value={task.utilisateur ? task.utilisateur.id : ""}
                  onChange={handleInputChange2}
                >
                  <option value="">Sélectionner un utilisateur</option>
                  {utilisateurs.map((utilisateur) => (
                    <option key={utilisateur.id} value={utilisateur.id}>
                      {utilisateur.nom} {/* Adaptez selon les champs de votre API */}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-actions">
                <button type="submit">Enregistrer</button>
                <button type="button" onClick={handleCloseModal2}>
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
                          onDoubleClick={() => handleTaskDoubleClick(task)}
                          className="task-item"
                        >
                          <span className="task-title ">{task.title}</span>
                          <span className="task-info assigned-style"style={{ width: '200px' }}>
                          <FaUser /> Assigné : <strong>{task.utilisateur ? task.utilisateur.nom : "Non assigné"}</strong>
                          </span>
                          <span className="task-info due-date-style">
                            <FaCalendarAlt /> Due Date : <strong>{  task.dueDate}</strong> 
                          </span>
                          <span className={`task-info priority-${task.priority?.toLowerCase()} priority-style`}>
                            <FaFlag /> Priorité : <strong>{task.priority}</strong>
                          </span>
                                                    <span  style={{ color: "#6c757d" }}>
                                                      <FaFlag /> Projet : <strong>{task.projet.name}</strong>
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
     {/* Separator */}
    <hr className="projects-separator" />
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
                          onDoubleClick={() => handleTaskDoubleClick(task)}
                          className="task-item"
                        >
                          <span className="task-title ">{task.title}</span>
                          <span className="task-info assigned-style">
                          <FaUser /> Assigné : <strong>{task.utilisateur ? task.utilisateur.nom : "Non assigné"}</strong>
                          </span>
                          <span className="task-info due-date-style">
                            <FaCalendarAlt /> Due Date : <strong>{  task.dueDate}</strong> 
                          </span>
                          <span className={`task-info priority-${task.priority?.toLowerCase()} priority-style`}>
                            <FaFlag /> Priorité : <strong>{task.priority}</strong>
                          </span>
                                                    <span  style={{ color: "#6c757d" }}>
                                                      <FaFlag /> Projet : <strong>{task.projet.name}</strong>
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
     {/* Separator */}
    <hr className="projects-separator" />
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
                          onDoubleClick={() => handleTaskDoubleClick(task)}
                          className="task-item"
                        >
                          <span className="task-title ">{task.title}</span>
                          <span className="task-info assigned-style">
                          <FaUser /> Assigné : <strong>{task.utilisateur ? task.utilisateur.nom : "Non assigné"}</strong>
                          </span>
                          <span className="task-info due-date-style">
                            <FaCalendarAlt /> Due Date : <strong>{  task.dueDate}</strong> 
                          </span>
                          <span className={`task-info priority-${task.priority?.toLowerCase()} priority-style`}>
                            <FaFlag /> Priorité : <strong>{task.priority}</strong>
                          </span>
                                                    <span  style={{ color: "#6c757d" }}>
                                                      <FaFlag /> Projet : <strong>{task.projet.name}</strong>
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

