package com.example.GesPro.Controller;

import com.example.GesPro.Entite.Projet;
import com.example.GesPro.Entite.Tache;
import com.example.GesPro.Entite.Tache1;
import com.example.GesPro.Service.ProjetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/projets")
public class ProjetController {

    @Autowired
    private ProjetService projetService;

    @GetMapping
    public List<Projet> getAllProjets() {
        return projetService.getAllProjets();
    }




    @GetMapping("/{id}")
    public ResponseEntity<Projet> getProjetById(@PathVariable Long id) {
        Projet projet = projetService.getProjetById(id);
        if (projet != null) {
            return ResponseEntity.ok(projet);  // Status 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Status 404 Not Found
        }
    }

    @PostMapping
    public ResponseEntity<Projet> createProjet(@RequestBody Projet projet) {
        Projet createdProjet = projetService.createProjet(projet);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProjet);  // Status 201 Created
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProjet(@PathVariable Long id) {
        projetService.deleteProjet(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Status 204 No Content
    }



    @GetMapping("/{id}/taches")
    public ResponseEntity<List<Tache>> getTachesByProjetId(@PathVariable Long id) {
        List<Tache> taches = projetService.getTachesByProjetId(id);
        if (taches.isEmpty()) {
            return ResponseEntity.noContent().build(); // Retourner 204 si aucune tâche n'est trouvée
        }
        return ResponseEntity.ok(taches); // Retourner les tâches avec un code 200 OK
    }
    // Méthode pour récupérer les projets par responsable
    @GetMapping("/responsable/{id}")
    public List<Projet> getProjetsByResponsableId(@PathVariable Long id) {
        return projetService.getProjetsByResponsableId(id); // Renvoie les projets associés à l'ID du responsable
    }


    @PutMapping("/{id}")
    public ResponseEntity<Projet> updateProjet(
            @PathVariable Long id,
            @RequestBody Projet projetDetails) {

        Projet updatedProjet = projetService.updateProjet(id, projetDetails);
        if (updatedProjet != null) {
            return ResponseEntity.ok(updatedProjet);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
