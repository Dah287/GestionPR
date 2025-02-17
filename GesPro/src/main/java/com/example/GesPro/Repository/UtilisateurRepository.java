package com.example.GesPro.Repository;

import com.example.GesPro.Entite.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
}