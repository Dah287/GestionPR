import React, { useState, useEffect } from "react";
import "./Utilisateur.css"; // Créez ce fichier CSS
import { FaTrash, FaPlus } from "react-icons/fa";
import useAutoLogout from "./useAutoLogout";

const Utilisateur = () => {
    useAutoLogout();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    nom: "",
    email: "",
    password: "",
    role: "",
  });
  const [editUser, setEditUser] = useState(null); // Utilisateur sélectionné pour la mise à jour

useEffect(() => {
  const token = localStorage.getItem("token"); // récupère le token stocké au login

  fetch("http://192.168.1.80:8081/api/utilisateurs", {
    headers: {
      Authorization: `Bearer ${token}`, // <-- ajout du token
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setUtilisateurs(data);
    })
    .catch((error) =>
      console.error("Erreur lors du chargement des utilisateurs :", error)
    );
}, []);

const handleAddUser = () => {
  const token = localStorage.getItem("token");

  fetch("http://192.168.1.80:8081/api/utilisateurs/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // <-- ajout du token
    },
    body: JSON.stringify(newUser),
  })
    .then((response) => response.json())
    .then((data) => {
      setUtilisateurs([...utilisateurs, data]);
      setShowModal(false);
      setNewUser({ nom: "", email: "", password: "", role: "" });
    })
    .catch((error) =>
      console.error("Erreur lors de l'ajout de l'utilisateur :", error)
    );
};

const handleDeleteUser = (userId) => {
  if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
    const token = localStorage.getItem("token");

    fetch(`http://192.168.1.80:8081/api/utilisateurs/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // <-- ajout du token
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la suppression de l'utilisateur");
        }
        setUtilisateurs(utilisateurs.filter((user) => user.id !== userId));
      })
      .catch((error) =>
        console.error("Erreur lors de la suppression de l'utilisateur :", error)
      );
  }
};

const handleUpdateUser = () => {
  const token = localStorage.getItem("token");

  fetch(`http://192.168.1.80:8081/api/utilisateurs/${editUser.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // <-- ajout du token
    },
    body: JSON.stringify(editUser),
  })
    .then((response) => response.json())
    .then((data) => {
      setUtilisateurs(
        utilisateurs.map((user) =>
          user.id === data.id ? { ...user, ...data } : user
        )
      );
      setEditUser(null);
    })
    .catch((error) =>
      console.error("Erreur lors de la mise à jour de l'utilisateur :", error)
    );
};

  return (
    <div className="users-list-container">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3>Liste des utilisateurs</h3>
        <button className="add-user-btn" onClick={() => setShowModal(true)}>
          <FaPlus className="icon" /> Ajouter utilisateur
        </button>
      </div>
   {/* Separator */}
    <hr className="projects-separator" />
      <div className="user-list">
        {utilisateurs.map((user) => (
          <div
            key={user.id}
            className="user-card"
            style={{ position: "relative" }}
          onDoubleClick={() => {
  // Ne copie PAS le mot de passe (il est hashé en base)
  const { id, nom, email, role } = user;
  setEditUser({ id, nom, email, role, password: "" });
}} // Double clic pour commencer la mise à jour
          >
            <h4 className="user-title">👤 {user.nom}</h4>
            
            <p>Role: {user.role.toUpperCase()}</p>

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
      
      <label htmlFor="nom">Nom</label>
      <input
        id="nom"
        type="text"
        placeholder="Nom"
        value={newUser.nom}
        onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
      />
      
      <label htmlFor="email">Username</label>
      <input
        id="email"
        type="email"
        placeholder="Username"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      
      <label htmlFor="password">Mot de passe</label>
      <input
        id="password"
        type="password"
        placeholder="Mot de passe"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />
      
      <label htmlFor="role">Rôle</label>
      <select
        id="role"
        value={newUser.role}
        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
      >
        <option value="">Sélectionner un rôle</option>
        <option value="admin">ADMIN</option>
        <option value="user">USER</option>
      </select>
      
      <div className="modal-buttons">
        <button onClick={handleAddUser}>Ajouter</button>
        <button onClick={() => setShowModal(false)}>Annuler</button>
      </div>
    </div>
  </div>
)}

{editUser && (
  <div className="modal">
    <div className="modal-content">
      <h3>Modifier l'utilisateur</h3>
      
      <label htmlFor="editNom">Nom</label>
      <input
        id="editNom"
        type="text"
        placeholder="Nom"
        value={editUser.nom}
        onChange={(e) => setEditUser({ ...editUser, nom: e.target.value })}
      />
      
      <label htmlFor="editEmail">Username</label>
      <input
        id="editEmail"
        type="email"
        placeholder="Username"
        value={editUser.email}
        onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
      />
      
<label htmlFor="editPassword">Nouveau mot de passe </label>
<input
  id="editPassword"
  type="password"
  placeholder="Laisser vide si inchangé"
  value={editUser?.password || ""}
  onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
/>
      
      <label htmlFor="editRole">Rôle</label>
      <select
        id="editRole"
        value={editUser.role}
        onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
      >
        <option value="admin">ADMIN</option>
        <option value="user">USER</option>
      </select>
      
      <div className="modal-buttons">
        <button onClick={handleUpdateUser}>Mettre à jour</button>
        <button onClick={() => setEditUser(null)}>Annuler</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Utilisateur;
