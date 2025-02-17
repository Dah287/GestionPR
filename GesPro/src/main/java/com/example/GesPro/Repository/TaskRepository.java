package com.example.GesPro.Repository;

import com.example.GesPro.Entite.Projet;
import com.example.GesPro.Entite.Task;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskRepository extends JpaRepository<Task, Long> {
}
