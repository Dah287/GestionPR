import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Board from "./components/Board";
import TaskList from './components/TaskList';
import Nav from './components/Nav';  // Import du composant Nav
import Header from './components/Header'; // Import du composant Header
import Projet from './components/Projet';
import Dashboard from './components/Dashboard';

import ChatTemplate from './components/ChatTemplate';
import Login from './components/Login';
import MesTaches from './components/User/MesTaches';
import ChatTemplatee from './components/ChatTemplatee';
import Utilisateur from './components/Utilisateur';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header en haut */}
        <Header />

        <div className="main-content">
          {/* Navigation à gauche */}
       

          {/* Contenu principal, avec un margin-left pour ne pas être caché par la nav */}
          <div className="content">
            <div className="container-fluid">
              <Routes>
              <Route  path="/" element={<Login />} />
                <Route exact path="/projet" element={<Projet/>} /> 
                <Route  path="/board" element={<Board />} />
                <Route  path="/list" element={<TaskList />} />
                <Route  path="/dashboard" element={<Dashboard />} />
                <Route  path="/chat" element={<ChatTemplate />} />
                <Route  path="/MesTaches" element={<MesTaches />} />
                <Route  path="/msg" element={<ChatTemplatee />} />
                <Route  path="/user" element={<Utilisateur />} />
                {/* Autres routes si nécessaire */}
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
