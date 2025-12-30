package com.example.GesPro.Service;

import com.example.GesPro.Entite.Utilisateur;
import com.example.GesPro.Repository.UtilisateurRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();  // Récupère tous les utilisateurs
    }

    public Utilisateur getUtilisateurById(Long id) {
        // Utilisation de Optional pour éviter les erreurs si l'utilisateur n'est pas trouvé
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        return utilisateurOptional.orElse(null);  // Renvoie null si l'utilisateur n'est pas trouvé
    }



    public boolean deleteUtilisateur(Long id) {
        // Vérifie si l'utilisateur existe avant de tenter de le supprimer
        if (utilisateurRepository.existsById(id)) {
            utilisateurRepository.deleteById(id);
            return true;
        }
        return false;  // Retourne false si l'utilisateur n'existe pas
    }

    // Méthode pour vérifier l'authentification de l'utilisateur
    public Utilisateur login(String email, String nom) {
        Optional<Utilisateur> utilisateur = utilisateurRepository.findByEmailAndPassword(email, nom);
        return utilisateur.orElse(null); // Renvoie l'utilisateur trouvé ou null
    }

    public Utilisateur updateUser(Long id, Utilisateur updatedUser) {
        Utilisateur existingUser = utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));

        // Mettre à jour les champs simples
        existingUser.setNom(updatedUser.getNom());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRole(updatedUser.getRole());

        // 🔐 Ne mettre à jour le mot de passe que s'il est fourni et non vide
        String rawPassword = updatedUser.getPassword();
        if (rawPassword != null && !rawPassword.trim().isEmpty()) {
            existingUser.setPassword(passwordEncoder.encode(rawPassword));
        }

        return utilisateurRepository.save(existingUser);
    }


    // 🔹 Enregistrement avec encodage du mot de passe
    public Utilisateur registerUtilisateur(String nom, String email, String password, String role) {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(nom);
        utilisateur.setEmail(email);
        utilisateur.setPassword(passwordEncoder.encode(password));
        utilisateur.setRole(role);

        return utilisateurRepository.save(utilisateur);
    }
    // UtilisateurService.java
    public Optional<Utilisateur> findByEmail(String email) {
        return utilisateurRepository.findByEmail(email);
    }
}
