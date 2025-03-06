package com.example.GesPro.Controller;

import com.example.GesPro.Entite.Utilisateur;
import com.example.GesPro.Service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin("*")
@RequestMapping("/utilisateurs")
public class UtilisateurController {

    @Autowired
    private UtilisateurService utilisateurService;

    @GetMapping
    public List<Utilisateur> getAllUtilisateurs() {
        return utilisateurService.getAllUtilisateurs();
    }


    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getUtilisateurById(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurService.getUtilisateurById(id);
        if (utilisateur != null) {
            return ResponseEntity.ok(utilisateur);  // Status 200 OK
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // Status 404 Not Found
        }
    }

    @PostMapping
    public ResponseEntity<Utilisateur> createUtilisateur(@RequestBody Utilisateur utilisateur) {
        Utilisateur createdUtilisateur = utilisateurService.createUtilisateur(utilisateur);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUtilisateur);  // Status 201 Created
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUtilisateur(@PathVariable Long id) {
        utilisateurService.deleteUtilisateur(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();  // Status 204 No Content
    }
    @PostMapping("login")
    public ResponseEntity<Utilisateur> login(@RequestBody Utilisateur loginRequest) {
        Optional<Utilisateur> utilisateurOpt = Optional.ofNullable(utilisateurService.login(loginRequest.getNom(), loginRequest.getPassword()));

        if (utilisateurOpt.isPresent()) {
            Utilisateur utilisateur = utilisateurOpt.get();
            return ResponseEntity.ok(utilisateur); // Renvoie les détails de l'utilisateur, y compris l'ID
        }

        return ResponseEntity.status(401).body(null); // Unauthorized si les identifiants sont incorrects
    }

}
