package com.example.GesPro.Repository;


import com.example.GesPro.Entite.Phase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PhaseRepository extends JpaRepository<Phase, Long> {
    List<Phase> findByMarcheNumero(String numero);

    @Query("SELECT p FROM Phase p WHERE p.dateFinPrevue BETWEEN :today AND :j7 AND p.dateFinReelle IS NULL")
    List<Phase> findPhasesARisque(@Param("today") LocalDate today, @Param("j7") LocalDate j7);

    @Query("SELECT p FROM Phase p WHERE p.dateFinPrevue < :today AND p.dateFinReelle IS NULL")
    List<Phase> findPhasesEnRetard(@Param("today") LocalDate today);
}