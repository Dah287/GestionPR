import React, { useState, useEffect } from "react";
import "./Projet.css";
import { useNavigate } from "react-router-dom";

import { FaTrash, FaPlus, FaChevronRight , FaEdit } from "react-icons/fa";
import useAutoLogout from "./useAutoLogout";
const Projet = () => {
    useAutoLogout();
  const [projets, setProjets] = useState([]);
  const [selectedProjet, setSelectedProjet] = useState(
    localStorage.getItem("selectedProjet") || null
  );
const [editProjet, setEditProjet] = useState(null); // Projet sélectionné pour édition
  const idUtilisateur = localStorage.getItem("id_utilisateur");
  const [showModal, setShowModal] = useState(false);
  const [newProjet, setNewProjet] = useState({
    name: "",
    description: "",
    responsable : {
        id: ""
    },
    priority: "",
    commencer: "",
    fin: ""

  });



  const handleEditProject = (projet) => {
  // Formater les dates pour les inputs (au format YYYY-MM-DD)
  const formatDateForInput = (dateStr) => dateStr ? dateStr.split('T')[0] : '';

  setEditProjet({
    ...projet,
    commencer: formatDateForInput(projet.commencer),
    fin: formatDateForInput(projet.fin),
  });
};

const handleUpdateProject = () => {
  const token = localStorage.getItem("token");

  // Ne pas envoyer les tâches ni l'id dans le payload de mise à jour
  const { id, taches, ...updateData } = editProjet;

  fetch(`http://192.168.1.80:8081/api/projets/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  })
    .then((response) => response.json())
    .then((updatedProjet) => {
      // Mettre à jour la liste locale
      setProjets(projets.map(p => p.id === id ? { ...updatedProjet, taches: p.taches } : p));
      setEditProjet(null);
    })
    .catch((error) => {
      console.error("Erreur lors de la mise à jour du projet :", error);
      alert("Erreur lors de la mise à jour");
    });
};


  useEffect(() => {
  const token = localStorage.getItem("token"); // Récupère le JWT stocké après login

  fetch(`http://192.168.1.80:8081/api/projets/responsable/${idUtilisateur}`, {
    headers: {
      Authorization: `Bearer ${token}`, // <-- Ajout du token
    },
  })
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
      //console.log("Données reçues :", data);
      if (!Array.isArray(data)) {
        throw new Error("Format JSON invalide : attendu un tableau");
      }

      // Charger les tâches pour chaque projet
      const projetsAvecTaches = data.map((projet) =>
        fetch(`http://192.168.1.80:8081/api/projets/${projet.id}/taches`, {
          headers: {
            Authorization: `Bearer ${token}`, // <-- Ajout du token
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
            }
            return response.json();
          })
          .then((taches) => ({ ...projet, taches }))
          .catch((error) => {
            console.error(
              `Erreur lors du chargement des tâches du projet ${projet.id}`,
              error
            );
            return { ...projet, taches: [] };
          })
      );

      return Promise.all(projetsAvecTaches);
    })
    .then((projetsFinal) => {
      setProjets(projetsFinal);
    })
    .catch((error) =>
      console.error("Erreur lors du chargement des projets :", error)
    );
}, [idUtilisateur]);

// Ajout d’un projet
const newProjet1 = {
  ...newProjet,
  responsable: {
    id: parseInt(idUtilisateur),
  },
};

const handleAddProject = () => {
  const token = localStorage.getItem("token");

  fetch("http://192.168.1.80:8081/api/projets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // <-- Ajout du token
    },
    body: JSON.stringify(newProjet1),
  })
    .then((response) => response.json())
    .then((data) => {
      setProjets([...projets, data]);
      setShowModal(false);
      setNewProjet({
        name: "",
        description: "",
        priority: "",
        commencer: "",
        fin: "",
      });
    })
    .catch((error) => console.error("Erreur lors de l'ajout du projet :", error));
};

// Suppression d’un projet
const handleDeleteProject = (projetId) => {
  const token = localStorage.getItem("token");

  if (window.confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
    fetch(`http://192.168.1.80:8081/api/projets/${projetId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // <-- Ajout du token
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression du projet");
        }
        setProjets(projets.filter((projet) => projet.id !== projetId));
      })
      .catch((error) =>
        console.error("Erreur lors de la suppression du projet :", error)
      );
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

    //console.log("Projet sélectionné :", projetId);

    // Stocke l'ID dans localStorage
    localStorage.setItem("selectedProjet", newSelectedProjet);

    // Redirection vers /list
    window.location.href = "/list";
  };

  const userId = localStorage.getItem("id_utilisateur");
  if (!userId) {
    return null;
  }


return ( 
  <div className="projects-dashboard">
    {/* Header */}
    <div className="projects-header">
      <h2 className="projects-title">Liste Des Projets</h2>
      <button className="add-project-btn" onClick={() => setShowModal(true)}>
        <FaPlus className="icon" /> Nouveau Projet
      </button>
    </div>

    {/* Separator */}
    <hr className="projects-separator" />

    {/* Projects Grid or Empty State */}
    {projets.length === 0 ? (
      <div className="no-projects">
        <p>🚀 Aucun projet disponible. Cliquez sur <b>"Nouveau Projet"</b> pour commencer.</p>
      </div>
    ) : (
      <div className="projects-grid">
        {projets.map((projet) => (
          <div 
            key={projet.id} 
            className={`project-card ${selectedProjet === projet.id ? "selected" : ""}`}
            onClick={() => handleProjetClick(projet.id)}
            onDoubleClick={() => handleProjetClick(projet.id)}
          >
<div className="project-card-header">
  <h3 className="project-name">
    <span className="project-icon">📋</span>
    {projet.name}
  </h3>
  <div className="project-actions">
    {/* ✅ Bouton Modifier */}
    <button 
      className="edit-project-btn"
      onClick={(e) => {
        e.stopPropagation();
        handleEditProject(projet); // À implémenter
      }}
      title="Modifier le projet"
    >
      <FaEdit size={14} />
    </button>
    
    {/* ❌ Bouton Supprimer */}
    <button 
      className="delete-project-btn"
      onClick={(e) => {
        e.stopPropagation();
        handleDeleteProject(projet.id);
      }}
      title="Supprimer le projet"
    >
      <FaTrash size={14} />
    </button>
  </div>
</div>

            <p className="project-description">{projet.description || "Aucune description"}</p>

            {/* Progress Bars */}
            <div className="progress-container">
              <div className="progress-item">
                <span className="progress-label">À faire</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill todo" 
                    style={{ width: `${calculateStatusPercentage(projet.taches, "TODO")}%` }}
                  ></div>
                </div>
                <span className="progress-percentage">
                  {calculateStatusPercentage(projet.taches, "TODO")}% 
                </span>
              </div>

              <div className="progress-item">
                <span className="progress-label">En cours</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill in-progress" 
                    style={{ width: `${calculateStatusPercentage(projet.taches, "IN_PROGRESS")}%` }}
                  ></div>
                </div>
                <span className="progress-percentage">
                  {calculateStatusPercentage(projet.taches, "IN_PROGRESS")}% 
                </span>
              </div>

              <div className="progress-item">
                <span className="progress-label">Terminé</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill done" 
                    style={{ width: `${calculateStatusPercentage(projet.taches, "DONE")}%` }}
                  ></div>
                </div>
                <span className="progress-percentage">
                  {calculateStatusPercentage(projet.taches, "DONE")}% 
                </span>
              </div>
            </div>

            <div className="project-footer">
              <span className="project-dates">
                {new Date(projet.commencer).toLocaleDateString()} - {new Date(projet.fin).toLocaleDateString()}
              </span>
              <span className={`project-priority ${projet.priority?.toLowerCase()}`}>
                {projet.priority}
              </span>
            </div>

            <div className="view-project">
              Voir les tâches <FaChevronRight className="arrow-icon" />
            </div>
          </div>
        ))}
      </div>
    )}

    {/* Add Project Modal */}
    {showModal && (
      <div className="modal-overlay">
        <div className="project-modal">
          <h3>Créer un nouveau projet</h3>
          <div className="form-group">
            <label>Nom du projet</label>
            <input
              type="text"
              value={newProjet.name}
              onChange={(e) => setNewProjet({ ...newProjet, name: e.target.value })}
              placeholder="Nommez votre projet"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newProjet.description}
              onChange={(e) => setNewProjet({ ...newProjet, description: e.target.value })}
              placeholder="Décrivez votre projet"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Date de début</label>
              <input
                type="date"
                value={newProjet.commencer}
                onChange={(e) => setNewProjet({ ...newProjet, commencer: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Date de fin</label>
              <input
                type="date"
                value={newProjet.fin}
                onChange={(e) => setNewProjet({ ...newProjet, fin: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Priorité</label>
            <select
              value={newProjet.priority}
              onChange={(e) => setNewProjet({ ...newProjet, priority: e.target.value })}
            >
              <option value="">Sélectionnez une priorité</option>
              <option value="Faible">Faible</option>
              <option value="Moyen">Moyen</option>
              <option value="HAUT">Haute</option>
            </select>
          </div>

          <div className="modal-actions">
            <button className="cancel-btn" onClick={() => setShowModal(false)}>
              Annuler
            </button>
            <button className="submit-btn" onClick={handleAddProject}>
              Créer le projet
            </button>
          </div>
        </div>
      </div>
    )}
{/* Modal d'édition */}
{editProjet && (
  <div className="modal-overlay">
    <div className="project-modal">
      <h3>Modifier le projet</h3>
      <div className="form-group">
        <label>Nom du projet</label>
        <input
          type="text"
          value={editProjet.name || ""}
          onChange={(e) => setEditProjet({ ...editProjet, name: e.target.value })}
          placeholder="Nommez votre projet"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={editProjet.description || ""}
          onChange={(e) => setEditProjet({ ...editProjet, description: e.target.value })}
          placeholder="Décrivez votre projet"
          rows="3"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Date de début</label>
          <input
            type="date"
            value={editProjet.commencer || ""}
            onChange={(e) => setEditProjet({ ...editProjet, commencer: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Date de fin</label>
          <input
            type="date"
            value={editProjet.fin || ""}
            onChange={(e) => setEditProjet({ ...editProjet, fin: e.target.value })}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Priorité</label>
        <select
          value={editProjet.priority || ""}
          onChange={(e) => setEditProjet({ ...editProjet, priority: e.target.value })}
        >
          <option value="">Sélectionnez une priorité</option>
          <option value="Faible">Faible</option>
          <option value="Moyen">Moyen</option>
          <option value="HAUT">Haute</option>
        </select>
      </div>

      <div className="modal-actions">
        <button className="cancel-btn" onClick={() => setEditProjet(null)}>
          Annuler
        </button>
        <button className="submit-btn" onClick={handleUpdateProject}>
          Mettre à jour
        </button>
      </div>
    </div>
  </div>
)}

  </div>
);

};

export default Projet;
