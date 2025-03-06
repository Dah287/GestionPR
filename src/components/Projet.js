import React, { useState, useEffect } from "react";
import "./Projet.css";
import { useNavigate } from "react-router-dom";
import { FaTrash,FaPlus  } from "react-icons/fa";

const Projet = () => {
  const [projets, setProjets] = useState([]);
  const [selectedProjet, setSelectedProjet] = useState(
    localStorage.getItem("selectedProjet") || null
  );

  const idUtilisateur = localStorage.getItem("id_utilisateur");
  const [showModal, setShowModal] = useState(false);
  const [newProjet, setNewProjet] = useState({
    name: "",
    description: "",
    responsable : {
        id: ""
    }
  });

  useEffect(() => {

    // if (!idUtilisateur) {
    //     console.error("Aucun utilisateur connecté !");
    //     return;
    //   }
    fetch(`http://localhost:8081/projets/responsable/${idUtilisateur}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.text();
      })
      .then((text) => {
        if (!text) {
          throw new Error("Réponse vide");
        }
        return JSON.parse(text);
      })
      .then((data) => {
        console.log("Données reçues :", data);
        if (!Array.isArray(data)) {
          throw new Error("Format JSON invalide : attendu un tableau");
        }

        const projetsAvecTaches = data.map((projet) =>
          fetch(`http://localhost:8081/projets/${projet.id}/taches`)
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Erreur HTTP: ${response.status}`);
              }
              return response.json();
            })
            .then((taches) => ({ ...projet, taches }))
            .catch((error) => {
              console.error(`Erreur lors du chargement des tâches du projet ${projet.id}`, error);
              return { ...projet, taches: [] };
            })
        );

        return Promise.all(projetsAvecTaches);
      })
      .then((projetsFinal) => {
        setProjets(projetsFinal);
      })
      .catch((error) => console.error("Erreur lors du chargement des projets :", error));
  }, []);

  const newProjet1 = {
    ...newProjet,
    responsable: {
      id: parseInt(idUtilisateur),
    },
  };

  const handleAddProject = () => {
    fetch("http://localhost:8081/projets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProjet1),
    })
      .then((response) => response.json())
      .then((data) => {
        setProjets([...projets, data]);
        setShowModal(false);
        setNewProjet({ name: "", description: "" });
      })
      .catch((error) => console.error("Erreur lors de l'ajout du projet :", error));
  };

  const handleDeleteProject = (projetId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      fetch(`http://localhost:8081/projets/${projetId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la suppression du projet");
          }
          // Mettre à jour la liste des projets après suppression
          setProjets(projets.filter((projet) => projet.id !== projetId));
        })
        .catch((error) => console.error("Erreur lors de la suppression du projet :", error));
    }
  };

  const calculateStatusPercentage = (taches, status) => {
    if (!taches || taches.length === 0) return 0;
    const count = taches.filter((task) => task.status === status).length;
    return Math.round((count / taches.length) * 100);
  };

  const handleProjetClick = (projetId) => {
    const newSelectedProjet = projetId === selectedProjet ? null : projetId;
    setSelectedProjet(newSelectedProjet);

    console.log("Projet sélectionné :", projetId);

    // Stocke l'ID dans localStorage
    localStorage.setItem("selectedProjet", newSelectedProjet);

    // Redirection vers /list
    window.location.href = "/list";
  };

  return (
    <div className="tasks-list-container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3>Liste des projets</h3>
        <button className="add-task-btn" onClick={() => setShowModal(true)}>
            <FaPlus className="icon" /> Ajouter projet
        </button>

      </div>
      <div className="project-list">
        {projets.map((projet) => (
          <div
            key={projet.id}
            className={`project-card ${selectedProjet === projet.id ? "selected" : ""}`}
            onClick={() => handleProjetClick(projet.id)}
            style={{ position: "relative" }}
          >
            <h4 className="project-title">🚀 Projet N°{projet.id} - {projet.name}</h4>

            {/* Icône de suppression en haut à droite */}
            <FaTrash
              className="project-delete-icon"
              onClick={(e) => {
                e.stopPropagation(); // Empêche le clic de propager au projet
                handleDeleteProject(projet.id);
              }}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                cursor: "pointer",
                fontSize: "20px",
                color: "red",
              }}
            />

            <div className="task-progress">
              {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
                <div key={status} className="task-progress-item">
                  <span className="status-label">{status.replace("_", " ")} :</span>
                  <span className="status-percentage">
                    {calculateStatusPercentage(projet.taches, status)}%
                  </span>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar ${status.toLowerCase()}`}
                      style={{ width: `${calculateStatusPercentage(projet.taches, status)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Ajouter un projet</h3>
            <input
              type="text"
              placeholder="Nom du projet"
              value={newProjet.name}
              onChange={(e) => setNewProjet({ ...newProjet, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Description"
              value={newProjet.description}
              onChange={(e) => setNewProjet({ ...newProjet, description: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={handleAddProject}>Ajouter</button>
              <button onClick={() => setShowModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projet;
