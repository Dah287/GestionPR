package com.example.GesPro.Repository;

import com.example.GesPro.Entite.Projet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjetRepository extends JpaRepository<Projet, Long> {
    List<Projet> findByResponsableId(Long responsableId); // Récupère les projets en fonction de l'ID du responsable
}
