package com.example.GesPro.Service;

import com.example.GesPro.Entite.Tache1;
import com.example.GesPro.Repository.TacheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TacheService {

    @Autowired
    private TacheRepository tacheRepository;

    public List<Tache1> getAllTaches() {
        return tacheRepository.findAll();  // Récupère toutes les tâches
    }

    public Tache1 getTacheById(Long id) {
        // Utilisation de Optional pour éviter des erreurs si l'élément n'est pas trouvé
        Optional<Tache1> tacheOptional = tacheRepository.findById(id);
        return tacheOptional.orElse(null);  // Renvoie null si la tâche n'est pas trouvée
    }

    public Tache1 createTache(Tache1 tache) {
        return tacheRepository.save(tache);  // Enregistre la tâche et la retourne
    }

    public boolean deleteTache(Long id) {
        // Vérifie si la tâche existe avant de tenter de la supprimer
        if (tacheRepository.existsById(id)) {
            tacheRepository.deleteById(id);
            return true;
        }
        return false;  // Retourne faux si la tâche n'existe pas
    }
}
