package com.example.GesPro.Repository;


import com.example.GesPro.Entite.Etape;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EtapeRepository extends JpaRepository<Etape, Long> {
    List<Etape> findByPhaseId(Long phaseId);
}