package com.example.GesPro.Service;

import com.example.GesPro.Entite.Projet;
import com.example.GesPro.Entite.Tache;
import com.example.GesPro.Entite.Tache1;
import com.example.GesPro.Repository.ProjetRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class ProjetService {

    @Autowired
    private ProjetRepository projetRepository;

    public List<Projet> getAllProjets() {
        return projetRepository.findAll();
    }

    public Projet getProjetById(Long id) {
        // Ici, on peut renvoyer un projet ou null, selon que le projet existe ou non
        Optional<Projet> projetOptional = projetRepository.findById(id);
        return projetOptional.orElse(null);  // Renvoie null si non trouvé
    }

    public Projet createProjet(Projet projet) {
        return projetRepository.save(projet);  // Enregistre et renvoie le projet créé
    }

    public boolean deleteProjet(Long id) {
        // Retourne vrai si le projet a été supprimé avec succès
        if (projetRepository.existsById(id)) {
            projetRepository.deleteById(id);
            return true;
        }
        return false;  // Si le projet n'existe pas
    }
    public List<Tache> getTachesByProjetId(Long projetId) {
        Optional<Projet> projet = projetRepository.findById(projetId);
        if (projet.isPresent()) {
            return projet.get().getTaches(); // Retourne la liste des tâches associées au projet
        }
        return Collections.emptyList(); // Retourner une liste vide si le projet n'existe pas
    }
    // Méthode pour récupérer les projets par ID du responsable
    public List<Projet> getProjetsByResponsableId(Long responsableId) {
        return projetRepository.findByResponsableId(responsableId);
    }
}
