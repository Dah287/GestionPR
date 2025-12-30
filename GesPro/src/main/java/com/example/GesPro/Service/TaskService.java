package com.example.GesPro.Service;

import com.example.GesPro.Entite.Tache;
import com.example.GesPro.Entite.Utilisateur;
import com.example.GesPro.Repository.TaskRepository;
import com.example.GesPro.Repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;


    @Autowired
    private UtilisateurRepository utilisateurRepository;


    @Autowired
    private EmailService emailService;
    // Ajouter une nouvelle tâche
    public Tache createTask(Tache task) {

        // ✅ Si une tâche est assignée à un utilisateur
        if (task.getUtilisateur() != null && task.getUtilisateur().getId() != null) {

            Utilisateur user = utilisateurRepository.findById(task.getUtilisateur().getId())
                    .orElse(null);

            if (user != null) {

                // ✅ Envoyer email
                String subject = "Nouvelle tâche assignée";
                String message =
                        "Bonjour " + user.getNom() + ",\n\n" +
                                "Une nouvelle tâche vous a été assignée.\n\n" +
                                "📌 Titre : " + task.getTitle() + "\n" +
                                "📊 Priority : " + task.getPriority() + "\n\n" +
                                "Merci et bonne journée.\n";

//                System.out.println("===== 📌 [DEBUG] createTask() START =====");
//
//                // ✅ Afficher la tâche reçue
//                System.out.println("📄 Tâche reçue :");
//                System.out.println(" - To   : " + user.getEmailSend());
//                System.out.println(" - Titre   : " + task.getTitle());
//                System.out.println(" - Statut  : " + task.getStatus());
//                System.out.println(" - Projet  : " + (task.getProjet() != null ? task.getProjet().getId() : "null"));
//                System.out.println(" - Utilisateur ID : " + (task.getUtilisateur() != null ? task.getUtilisateur().getId() : "null"));

                emailService.sendEmail(user.getEmailSend(), subject, message);

                task.setUtilisateur(user);
            }
        }

        return taskRepository.save(task);
    }

    // Récupérer une tâche par son ID
    public Optional<Tache> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // Mettre à jour une tâche Status
    public Tache updateTask(Long id, Tache taskDetails) {
        Tache task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(taskDetails.getStatus());
        return taskRepository.save(task);
    }
    // Mettre à jour une tâche
    public Tache updateTaskk(Long id, Tache taskDetails) {
        Tache task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setDueDate(taskDetails.getDueDate());
        task.setPriority(taskDetails.getPriority());
        task.setTitle(taskDetails.getTitle());
        task.setUtilisateur(taskDetails.getUtilisateur());
        return taskRepository.save(task);
    }
    // Récupérer toutes les tâches
    public List<Tache> getAllTasks() {
        return taskRepository.findAll();
    }

    // Supprimer une tâche
    public void deleteTask(Long id) {
        Tache task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        taskRepository.delete(task);
    }

    public List<Tache> getTachesByUserId(Long userId) {
        return taskRepository.findByUtilisateurId(userId);
    }

    public Tache updateTacheStatus(Long id,Tache taskDetails) {
        Tache task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(taskDetails.getStatus());
        return taskRepository.save(task);
    }
}
