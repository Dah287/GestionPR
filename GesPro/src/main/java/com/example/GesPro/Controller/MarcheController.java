package com.example.GesPro.Controller;


import com.example.GesPro.Entite.Marche;
import com.example.GesPro.Repository.MarcheRepository;
import com.example.GesPro.dto.MarcheRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/marches")
public class MarcheController {

    @Autowired
    private MarcheRepository marcheRepository;

    @PostMapping
    public ResponseEntity<Marche> create(@RequestBody MarcheRequest request) {
        Marche m = new Marche();
        m.setNumero(request.getNumero());
        m.setType(request.getType());
        m.setDateNotification(request.getDateNotification());
        m.setDateDemarrage(request.getDateDemarrage());
        m.setMontantEstime(request.getMontantEstime());
        return ResponseEntity.ok(marcheRepository.save(m));
    }

    @GetMapping
    public List<Marche> getAll() {
        return marcheRepository.findAll();
    }

    @GetMapping("/{numero}")
    public ResponseEntity<Marche> getByNumero(@PathVariable String numero) {
        Optional<Marche> m = marcheRepository.findById(numero);
        return m.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}