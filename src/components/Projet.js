import React, { useState, useEffect } from "react";
import "./Projet.css";
import { useNavigate } from "react-router-dom";

const Projet = () => {
  const [projets, setProjets] = useState([]);
  const [selectedProjet, setSelectedProjet] = useState(
    localStorage.getItem("selectedProjet") || null
  );

  useEffect(() => {
    fetch("http://localhost:8080/projets")
      .then((response) => response.json())
      .then((data) => {
        const projetsAvecTaches = data.map((projet) =>
          fetch(`http://localhost:8080/projets/${projet.id}/taches`)
            .then((response) => response.json())
            .then((taches) => ({ ...projet, taches }))
        );

        Promise.all(projetsAvecTaches).then((projetsFinal) => {
          setProjets(projetsFinal);
        });
      })
      .catch((error) => console.error("Erreur lors du chargement des projets", error));
  }, []);

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
    //navigate(`/list/${projetId}`); // Option alternative
  };

  return (
    <div className="tasks-list-container">
      <h3>📌 Liste des Projets</h3>
      <div className="project-list">
        {projets.map((projet) => (
          <div key={projet.id}             className={`project-card ${selectedProjet == projet.id ? "selected" : ""}`}
          onClick={() => handleProjetClick(projet.id)}>
            <h4 className="project-title">🚀 Projet N°{projet.id} - {projet.name}</h4>
            <div className="task-progress">
              {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
                <div key={status} className="task-progress-item">
                  <span className="status-label">{status.replace('_', ' ')} :</span> 
                  <span className="status-percentage"> {calculateStatusPercentage(projet.taches, status)}%</span>
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
    </div>
  );
};

export default Projet;
