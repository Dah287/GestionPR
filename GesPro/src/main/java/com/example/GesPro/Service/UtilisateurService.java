package com.example.GesPro.Service;

import com.example.GesPro.Entite.Utilisateur;
import com.example.GesPro.Repository.UtilisateurRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UtilisateurService {

    @Autowired
    private UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurRepository.findAll();  // Récupère tous les utilisateurs
    }

    public Utilisateur getUtilisateurById(Long id) {
        // Utilisation de Optional pour éviter les erreurs si l'utilisateur n'est pas trouvé
        Optional<Utilisateur> utilisateurOptional = utilisateurRepository.findById(id);
        return utilisateurOptional.orElse(null);  // Renvoie null si l'utilisateur n'est pas trouvé
    }

    public Utilisateur createUtilisateur(Utilisateur utilisateur) {
        return utilisateurRepository.save(utilisateur);  // Sauvegarde l'utilisateur et le retourne
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

}
