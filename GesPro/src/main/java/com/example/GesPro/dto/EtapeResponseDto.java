package com.example.GesPro.dto;

import java.time.LocalDate;

public class EtapeResponseDto {
    private Long id;
    private String code;
    private String libelle;
    private int delaiAvantFinJours;
    private LocalDate datePrevue;
    private LocalDate dateReelle;
    private boolean realisee;
    private Long phaseId;

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public int getDelaiAvantFinJours() { return delaiAvantFinJours; }
    public void setDelaiAvantFinJours(int delaiAvantFinJours) { this.delaiAvantFinJours = delaiAvantFinJours; }
    public LocalDate getDatePrevue() { return datePrevue; }
    public void setDatePrevue(LocalDate datePrevue) { this.datePrevue = datePrevue; }
    public LocalDate getDateReelle() { return dateReelle; }
    public void setDateReelle(LocalDate dateReelle) { this.dateReelle = dateReelle; }
    public boolean isRealisee() { return realisee; }
    public void setRealisee(boolean realisee) { this.realisee = realisee; }
    public Long getPhaseId() { return phaseId; }
    public void setPhaseId(Long phaseId) { this.phaseId = phaseId; }
}