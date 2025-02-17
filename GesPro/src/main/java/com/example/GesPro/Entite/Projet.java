package com.example.GesPro.Entite;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;
@Data
@Entity
public class Projet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "responsable_id")
    private Utilisateur responsable;

    @OneToMany(mappedBy = "projet", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Tache> taches;

    // Getters and Setters
    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Utilisateur getResponsable() {
        return responsable;
    }

    public List<Tache> getTaches() {
        return taches;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setResponsable(Utilisateur responsable) {
        this.responsable = responsable;
    }

    public void setTaches(List<Tache> taches) {
        this.taches = taches;
    }
}