import React from "react";
import { Search, LogOut } from "lucide-react"; // Icônes
import { useNavigate } from "react-router-dom";
import "./Header.css";
import { Home, Inbox, MessageCircle, FilePlus, FileText, LayoutDashboard, MoreHorizontal, Grid, BarChart } from "lucide-react";
import "./Nav.css";

const Header = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("id_utilisateur"); // Vérifie si l'utilisateur est connecté

  // Fonction de déconnexion
  const handleLogout = () => {
    // Supprimer l'ID utilisateur du localStorage
    localStorage.removeItem("id_utilisateur");
   
    // Rediriger vers la page de connexion
    navigate("/");
  
    // Rafraîchir la page pour que tout soit réinitialisé (comme un refresh)
  
  };
  

  // Ne pas afficher le header si l'utilisateur n'est pas connecté
  if (!userId) {
    return null;
  }

  return (
    <>
    <header className="header">
      <div className="header-container">
        {/* Barre de recherche */}
        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Rechercher..." />
        </div>

        {/* Boutons de navigation */}

        <button className="header-btn mm" >Gérer les utilisateurs</button>
        {/* Bouton de déconnexion */}
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={22} /> Déconnexion
        </button>
      </div>
    </header>
    <nav className="nav">
      <div className="navbar-brand">
        <a href="#">
          <img src="/ormvad_1.jpg" alt="Logo" className="logo" />
        </a>
      </div>
      <ul>
        <li><a href="/projet"><Home size={20} /> <span>Home</span></a></li>
        <li><a href="/dashboard"><BarChart size={20} /> <span>Dashboard</span></a></li>
        <li><a href="/list"><Inbox size={20} /> <span>Liste</span></a></li>
        <li><a href="/board"><Grid size={20} /> <span>Board</span></a></li>
        <li><a href="/chat"><MessageCircle size={20} /> <span>Chat</span></a></li>
        <li><a href="#"><FilePlus size={20} /> <span>Create Doc</span></a></li>
        <li><a href="#"><FileText size={20} /> <span>Docs</span></a></li>
        <li><a href="#"><LayoutDashboard size={20} /> <span>Create Dashboard</span></a></li>
        <li><a href="#"><LayoutDashboard size={20} /> <span>Dashboards</span></a></li>
        <li><a href="#"><MoreHorizontal size={20} /> <span>More</span></a></li>
      </ul>
    </nav>
    </>
  );
};

export default Header;
