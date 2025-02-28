import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Board from "./components/Board";
import TaskList from './components/TaskList';
import Nav from './components/Nav';  // Import du composant Nav
import Header from './components/Header'; // Import du composant Header
import Projet from './components/Projet';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Header en haut */}
        <Header />

        <div className="main-content">
          {/* Navigation à gauche */}
          <Nav />

          {/* Contenu principal, avec un margin-left pour ne pas être caché par la nav */}
          <div className="content">
            <div className="container-fluid">
              <Routes>
                <Route exact path="/" element={<Board />} />
                <Route exact path="/list" element={<TaskList />} />
                <Route exact path="/projet" element={<Projet/>} />

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
