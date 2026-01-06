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
import PrivateRoute from './components/PrivateRoute'; // ✅ import
import { MarcheTimeline } from './components/MarcheTimeline';
import { MarcheTimelineStatus } from './components/MarcheTimelineStatus';
import { MarcheTimeline1 } from './components/MarcheTimeline1';

function AppContent() {
  const location = useLocation();
  const hideHeaderRoutes = ["/", "/login"];
  const shouldHideHeader = hideHeaderRoutes.includes(location.pathname);

  return (
    <div className="app-container">
      {!shouldHideHeader && <Header />}

      <div className="main-content">
        <div className="content">
          <div className="container-fluid">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
                <Route path="/marches" element={<MarcheTimeline />} />
                              {/* <Route path="/marches1" element={<MarcheTimelineStatus />} />
                              <Route path="/marches2" element={<MarcheTimeline1 />} /> */}

              {/* Routes privées → protégées */}
              <Route path="/projet" element={
                <PrivateRoute><Projet /></PrivateRoute>
              } />
                            <Route path="/marches" element={
                <PrivateRoute><MarcheTimeline /></PrivateRoute>
              } />
                            <Route path="/marches2" element={
                <PrivateRoute><MarcheTimeline1 /></PrivateRoute>
              } />
              <Route path="/board" element={
                <PrivateRoute><Board /></PrivateRoute>
              } />
              <Route path="/list" element={
                <PrivateRoute><TaskList /></PrivateRoute>
              } />
              <Route path="/listFiltre" element={
                <PrivateRoute><TaskListFiltre /></PrivateRoute>
              } />
              <Route path="/dashboard" element={
                <PrivateRoute><Dashboard /></PrivateRoute>
              } />
              <Route path="/chat" element={
                <PrivateRoute><ChatTemplate /></PrivateRoute>
              } />
              <Route path="/MesTaches" element={
                <PrivateRoute><MesTaches /></PrivateRoute>
              } />
              <Route path="/msg" element={
                <PrivateRoute><ChatTemplatee /></PrivateRoute>
              } />
              <Route path="/user" element={
                <PrivateRoute><Utilisateur /></PrivateRoute>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;