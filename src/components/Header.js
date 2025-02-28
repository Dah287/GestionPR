import React from "react";
import { Search } from "lucide-react"; // Icône de recherche
import { useNavigate } from "react-router-dom"; 
import "./Header.css";

const Header = () => {


    const navigate = useNavigate();
  return (
    <header className="header">
      <div className="header-container">
    
        
        <div className="search-bar">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder="Rechercher..." />
        </div>

        <div className="header-buttons">
        <button className="header-btn" onClick={() => navigate("/list")}>Liste</button>
        <button className="header-btn" onClick={() => navigate("/board")}>Board</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
