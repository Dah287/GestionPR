package com.example.GesPro.Repository;

import com.example.GesPro.Entite.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByEmailAndPassword(String email, String nom);
}