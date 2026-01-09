package com.example.GesPro.Controller;

import com.example.GesPro.Entite.Marche;
import com.example.GesPro.Entite.Phase;
import com.example.GesPro.Repository.MarcheRepository;
import com.example.GesPro.Repository.PhaseRepository;
import com.example.GesPro.dto.PhaseRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/phases")
public class PhaseController {

    @Autowired
    private PhaseRepository phaseRepository;
    @Autowired
    private MarcheRepository marcheRepository;

    @PostMapping
    public ResponseEntity<Phase> create(@RequestBody PhaseRequest request) {
        Optional<Marche> marcheOpt = marcheRepository.findById(request.getMarcheNumero());
        if (marcheOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Phase p = new Phase();
        p.setNom(request.getNom());
        p.setDureeMois(request.getDureeMois());
        p.setPourcentageMontant(request.getPourcentageMontant());
        p.setDateDebut(request.getDateDebut());
        p.setDateFinPrevue(request.getDateFinPrevue());
        p.setMarche(marcheOpt.get());
        return ResponseEntity.ok(phaseRepository.save(p));
    }

    @GetMapping("/marche/{marcheNumero}")
    public List<Phase> getPhasesByMarche(@PathVariable String marcheNumero) {
        return phaseRepository.findByMarcheNumero(marcheNumero);
    }
}