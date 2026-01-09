package com.example.GesPro.dto;

public class EtapeRequest {
    private String code;
    private String libelle;
    private int delaiAvantFinJours;
    private String datePrevue; // "yyyy-MM-dd"
    private Long phaseId;

    // Getters & Setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getLibelle() { return libelle; }
    public void setLibelle(String libelle) { this.libelle = libelle; }
    public int getDelaiAvantFinJours() { return delaiAvantFinJours; }
    public void setDelaiAvantFinJours(int delaiAvantFinJours) { this.delaiAvantFinJours = delaiAvantFinJours; }
    public String getDatePrevue() { return datePrevue; }
    public void setDatePrevue(String datePrevue) { this.datePrevue = datePrevue; }
    public Long getPhaseId() { return phaseId; }
    public void setPhaseId(Long phaseId) { this.phaseId = phaseId; }
}