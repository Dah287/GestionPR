package com.example.GesPro.Service;

import com.example.GesPro.Entite.Tache;
import com.example.GesPro.Repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // Ajouter une nouvelle tâche
    public Tache createTask(Tache task) {
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
