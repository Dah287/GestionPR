import React, { useState, useEffect } from "react";
import "./Utilisateur.css"; // Créez ce fichier CSS
import { FaTrash, FaPlus } from "react-icons/fa";

const Utilisateur = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: "",
    
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    fetch("http://localhost:8081/utilisateurs")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setUtilisateurs(data);
      })
      .catch((error) => console.error("Erreur lors du chargement des utilisateurs :", error));
  }, []);

  const handleAddUser = () => {
    fetch("http://localhost:8081/utilisateurs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        setUtilisateurs([...utilisateurs, data]);
        setShowModal(false);
        setNewUser({ nom: "", email: "", password: "", role: "" });
      })
      .catch((error) => console.error("Erreur lors de l'ajout de l'utilisateur :", error));
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      fetch(`http://localhost:8081/utilisateurs/${userId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Erreur lors de la suppression de l'utilisateur");
          }
          setUtilisateurs(utilisateurs.filter((user) => user.id !== userId));
        })
        .catch((error) => console.error("Erreur lors de la suppression de l'utilisateur :", error));
    }
  };

  return (
    <div className="users-list-container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3>Liste des utilisateurs</h3>
        <button className="add-user-btn" onClick={() => setShowModal(true)}>
          <FaPlus className="icon" /> Ajouter utilisateur
        </button>
      </div>
      <div className="user-list">
        {utilisateurs.map((user) => (
          <div key={user.id} className="user-card" style={{ position: "relative" }}>
            <h4 className="user-title">👤 {user.nom}</h4>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <FaTrash
              className="user-delete-icon"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteUser(user.id);
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
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Ajouter un utilisateur</h3>
            <input
              type="text"
              placeholder="Nom"
              value={newUser.nom}
              onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
            />

            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
                <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                <option value="">Sélectionner un rôle</option>
                <option value="Chef de projet">Chef de projet</option>
                <option value="Utilisateur Normal">Utilisateur Normal</option>
                </select>
            <div className="modal-buttons">
              <button onClick={handleAddUser}>Ajouter</button>
              <button onClick={() => setShowModal(false)}>Annuler</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Utilisateur;