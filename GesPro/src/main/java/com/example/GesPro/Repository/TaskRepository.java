package com.example.GesPro.Repository;

import com.example.GesPro.Entite.Tache;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Tache, Long> {
    List<Tache> findByUtilisateurId(Long userId);
}
