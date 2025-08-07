import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Board from "./components/Board";
import TaskList from './components/TaskList';
import Nav from './components/Nav';
import Header from './components/Header';
import Projet from './components/Projet';
import Dashboard from './components/Dashboard';
import ChatTemplate from './components/ChatTemplate';
import Login from './components/Login';
import MesTaches from './components/User/MesTaches';
import ChatTemplatee from './components/ChatTemplatee';
import Utilisateur from './components/Utilisateur';
import TaskListFiltre from './components/TaskListFiltre';

// Composant séparé pour utiliser useLocation()
function AppContent() {
  const location = useLocation();
  const hideHeaderRoutes = ["/", "/login"]; // ici "/" correspond à Login, modifie si besoin

  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {/* Header en haut */}
      {!shouldHideHeader && <Header />}

      <div className="main-content">
        {/* Navigation à gauche */}


        {/* Contenu principal */}
        <div className="content">
          <div className="container-fluid">
            <Routes>
            <Route  path="/" element={<Login />} />
               <Route  path="/login" element={<Login />} />
              <Route exact path="/projet" element={<Projet/>} /> 
              <Route  path="/board" element={<Board />} />
              <Route  path="/list" element={<TaskList />} />
              <Route  path="/listFiltre" element={<TaskListFiltre />} />
              <Route  path="/dashboard" element={<Dashboard />} />
              <Route  path="/chat" element={<ChatTemplate />} />
              <Route  path="/MesTaches" element={<MesTaches />} />
              <Route  path="/msg" element={<ChatTemplatee />} />
              <Route  path="/user" element={<Utilisateur />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

// App principal avec le Router autour
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


