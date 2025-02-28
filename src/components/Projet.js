import React, { useState, useEffect } from "react";
import "./Projet.css";
import { useNavigate } from "react-router-dom";

const Projet = () => {
  const [projets, setProjets] = useState([]); // État pour stocker les projets récupérés
  const [selectedProjet, setSelectedProjet] = useState(null);
  const navigate = useNavigate();
  // Charger les projets depuis l'API
  useEffect(() => {
    // Effectuer la requête pour récupérer les projets
    fetch("http://localhost:8080/projets")
      .then((response) => response.json()) // Convertir la réponse en JSON
      .then((data) => setProjets(data)) // Mettre à jour l'état avec les projets récupérés
      .catch((error) => console.error("Erreur lors du chargement des projets", error));
  }, []); // Le tableau vide [] signifie que cette requête ne s'effectuera qu'une seule fois, lors du montage du composant

  const handleClick = (projetId) => {
    setSelectedProjet(projetId === selectedProjet ? null : projetId); // Toggle la sélection
    console.log(projetId); // Afficher l'id du projet sélectionné dans la console
    //navigate(`/list/${projetId}`); 
    localStorage.setItem("selectedProjet", projetId); // Stocke l'ID en local
    window.location.href = "/list"; 

  };

  return (
<div className="tasks-list-container">
  <h3>Liste des Projets</h3>
  <ul className="project-list">
    {projets.map((projet) => (
      <li
        key={projet.id}
        className={`project-item ${selectedProjet === projet.id ? "selected" : ""}`}
        onClick={() => handleClick(projet.id)}
      >
        <div className="project-details">
          <span className="project-title">
            <strong>Projet N°{projet.id}</strong> - {projet.name}
          </span>
        </div>
        <div className="circle-progress-container">
          <div
            className="circle-progress"
            style={{ "--percentage": `${50}%` }}
          >
            {50}%
          </div>
        </div>
      </li>
    ))}
  </ul>
</div>

  );
};

export default Projet;
