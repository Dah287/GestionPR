package com.example.GesPro.Controller;

import com.example.GesPro.Entite.Tache1;
import com.example.GesPro.Service.TacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("*")
@RestController
@RequestMapping("/api/taches")
public class TacheController {

    @Autowired
    private TacheService tacheService;

    @GetMapping
    public List<Tache1> getAllTaches() {
        return tacheService.getAllTaches();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tache1> getTacheById(@PathVariable Long id) {
        Tache1 tache = tacheService.getTacheById(id);
        if (tache != null) {
            return ResponseEntity.ok(tache);  // Status 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Status 404 Not Found
        }
    }

    @PostMapping
    public ResponseEntity<Tache1> createTache(@RequestBody Tache1 tache) {
        Tache1 createdTache = tacheService.createTache(tache);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTache);  // Status 201 Created
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTache(@PathVariable Long id) {
        tacheService.deleteTache(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Status 204 No Content
    }
}
