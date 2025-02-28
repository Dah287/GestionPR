package com.example.GesPro.Controller;

import com.example.GesPro.Entite.Tache;
import com.example.GesPro.Service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;


    // Récupérer toutes les tâches
    @GetMapping
    public ResponseEntity<List<Tache>> getAllTasks() {
        List<Tache> tasks = taskService.getAllTasks();
        return ResponseEntity.ok(tasks);  // Retourne les tâches avec un status HTTP 200
    }
    // Ajouter une nouvelle tâche
    @PostMapping
    public ResponseEntity<Tache> createTask(@RequestBody Tache task) {
        Tache createdTask = taskService.createTask(task);
        return ResponseEntity.ok(createdTask);
    }

    // Récupérer une tâche par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Tache> getTaskById(@PathVariable Long id) {
        Optional<Tache> task = taskService.getTaskById(id);
        return task.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Mettre à jour une tâche
    @PutMapping("/{id}")
    public ResponseEntity<Tache> updateTask(@PathVariable Long id, @RequestBody Tache taskDetails) {
        Tache updatedTask = taskService.updateTask(id, taskDetails);
        return ResponseEntity.ok(updatedTask);
    }

    // Supprimer une tâche
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}
