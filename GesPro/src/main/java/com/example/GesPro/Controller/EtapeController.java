package com.example.GesPro.Controller;


import com.example.GesPro.Entite.Etape;
import com.example.GesPro.Entite.Phase;
import com.example.GesPro.Repository.EtapeRepository;
import com.example.GesPro.Repository.PhaseRepository;
import com.example.GesPro.dto.EtapeRequest;
import com.example.GesPro.dto.EtapeResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/etapes")
public class EtapeController {

    @Autowired
    private EtapeRepository etapeRepository;
    @Autowired
    private PhaseRepository phaseRepository;

    @PostMapping
    public ResponseEntity<EtapeResponseDto> create(@RequestBody EtapeRequest request) {
        Optional<Phase> phaseOpt = phaseRepository.findById(request.getPhaseId());
        if (phaseOpt.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Etape e = new Etape();
        e.setCode(request.getCode());
        e.setLibelle(request.getLibelle());
        e.setDelaiAvantFinJours(request.getDelaiAvantFinJours());
        e.setDatePrevue(LocalDate.parse(request.getDatePrevue()));
        e.setPhase(phaseOpt.get());
        e.setRealisee(false);

        Etape saved = etapeRepository.save(e);
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}/realise")
    public ResponseEntity<EtapeResponseDto> marquerCommeRealise(@PathVariable Long id) {
        Optional<Etape> opt = etapeRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Etape e = opt.get();
        e.setRealisee(true);
        e.setDateReelle(LocalDate.now());
        Etape saved = etapeRepository.save(e);
        return ResponseEntity.ok(toDto(saved));
    }

//    @PutMapping("/{id}/realise")
//    public ResponseEntity<EtapeResponseDto> basculerRealisation(@PathVariable Long id) {
//        Optional<Etape> opt = etapeRepository.findById(id);
//        if (opt.isEmpty()) {
//            return ResponseEntity.notFound().build();
//        }
//
//        Etape e = opt.get();
//
//        // Inverser l'état actuel
//        boolean nouvelEtat = !e.isRealisee();
//        e.setRealisee(nouvelEtat);
//
//        // Mettre à jour la date réelle uniquement si on passe à "réalisé"
//        if (nouvelEtat) {
//            e.setDateReelle(LocalDate.now());
//        } else {
//            // Optionnel : réinitialiser la date réelle si on annule
//            e.setDateReelle(null);
//        }
//
//        Etape saved = etapeRepository.save(e);
//        return ResponseEntity.ok(toDto(saved));
//    }

    @GetMapping("/phase/{phaseId}")
    public ResponseEntity<List<EtapeResponseDto>> getEtapesByPhase(@PathVariable Long phaseId) {
        List<Etape> etapes = etapeRepository.findByPhaseId(phaseId);
        List<EtapeResponseDto> dtos = etapes.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private EtapeResponseDto toDto(Etape e) {
        EtapeResponseDto dto = new EtapeResponseDto();
        dto.setId(e.getId());
        dto.setCode(e.getCode());
        dto.setLibelle(e.getLibelle());
        dto.setDelaiAvantFinJours(e.getDelaiAvantFinJours());
        dto.setDatePrevue(e.getDatePrevue());
        dto.setDateReelle(e.getDateReelle());
        dto.setRealisee(e.isRealisee());
        dto.setPhaseId(e.getPhase().getId());
        return dto;
    }
}