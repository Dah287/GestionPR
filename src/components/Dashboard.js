import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './Dashboard.css'; // Importation du fichier CSS pour le style
import useAutoLogout from './useAutoLogout';

// Enregistrement des éléments de chart.js nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    useAutoLogout();
  const [projets, setProjets] = useState([]);
  const [tasksByStatus, setTasksByStatus] = useState({});
  const [tasksByAssignee, setTasksByAssignee] = useState({});
  const [tasksDue, setTasksDue] = useState({ dueThisWeek: 0, overdue: 0 });

useEffect(() => {
  const token = localStorage.getItem("token"); // récupère le token stocké après login

  fetch("http://192.168.1.80:8081/api/projets", {
    headers: {
      Authorization: `Bearer ${token}`, // <-- ajout du token JWT
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      return response.text();
    })
    .then((text) => {
      if (!text) {
        throw new Error("Réponse vide");
      }
      return JSON.parse(text);
    })
    .then((data) => {
      if (!Array.isArray(data)) {
        throw new Error("Format JSON invalide : attendu un tableau");
      }

      // Pour chaque projet, charger ses tâches
      const projetsAvecTaches = data.map((projet) =>
        fetch(`http://192.168.1.80:8081/api/projets/${projet.id}/taches`, {
          headers: {
            Authorization: `Bearer ${token}`, // <-- ajout du token JWT
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erreur HTTP: ${response.status}`);
            }
            ////console.log("test : ",response.status)
            return response.json();
          })
          .then((taches) => ({ ...projet, taches }))
          .catch((error) => {
            console.error(
              `Erreur lors du chargement des tâches du projet ${projet.id}`,
              error
            );
            return { ...projet, taches: [] };
          })
      );

        return Promise.all(projetsAvecTaches);
      })
      .then((projetsFinal) => {
        setProjets(projetsFinal);

        // Calculer les tâches par statut et par assigné
        const statusCounts = {};
        const assigneeCounts = {};
        let dueThisWeek = 0;
        let overdue = 0;
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

projetsFinal.forEach((projet) => {
  projet.taches.forEach((tache) => {
    statusCounts[tache.status] = (statusCounts[tache.status] || 0) + 1;

    if (tache.utilisateur && tache.utilisateur.nom) {
      assigneeCounts[tache.utilisateur.nom] =
        (assigneeCounts[tache.utilisateur.nom] || 0) + 1;
    } else {
      assigneeCounts["Non assigné"] =
        (assigneeCounts["Non assigné"] || 0) + 1;
    }

    const dueDate = new Date(tache.dueDate);
    if (dueDate < today) {
      overdue += 1;
    } else if (dueDate >= today && dueDate <= nextWeek) {
      dueThisWeek += 1;
    }
  });
});


        setTasksByStatus(statusCounts);
        setTasksByAssignee(assigneeCounts);
        setTasksDue({ dueThisWeek, overdue });
      })
      .catch((error) => console.error("Erreur lors du chargement des projets :", error));
  }, []);

  return (
    <div className='tasks-list-container'>
    <div className="dashboard-container">
     
      <div className="charts-container">
        <div className="chart-box">
          <h3>Tâches par statut</h3>
          <Bar data={{
            labels: Object.keys(tasksByStatus),
            datasets: [{
              label: 'Nombre de tâches par statut',
              data: Object.values(tasksByStatus),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            }],
          }} />
        </div>
        <div className="chart-box">
          <h3>Tâches par assigné</h3>
          <Bar data={{
            labels: Object.keys(tasksByAssignee),
            datasets: [{
              label: 'Nombre de tâches par assigné',
              data: Object.values(tasksByAssignee),
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1,
            }],
          }} />
        </div>
        <div className="chart-box tasks-due">
          <h3>Tâches à échéance cette semaine ou en retard</h3>
          <div className="tasks-due-details">
            <p>📅 À échéance cette semaine : <span>{tasksDue.dueThisWeek}</span></p>
            <p>⚠️ En retard : <span>{tasksDue.overdue}</span></p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
