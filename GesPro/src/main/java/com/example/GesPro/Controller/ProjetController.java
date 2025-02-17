package com.example.GesPro.Controller;

import com.example.GesPro.Entite.Projet;
import com.example.GesPro.Service.ProjetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projets")
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
}
