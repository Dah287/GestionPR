package com.example.GesPro.Repository;

import com.example.GesPro.Entite.Tache;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TacheRepository extends JpaRepository<Tache, Long> {
}
