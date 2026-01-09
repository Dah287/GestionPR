package com.example.GesPro.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class PhaseRequest {
    private String nom;
    private int dureeMois;
    private BigDecimal pourcentageMontant;
    private LocalDate dateDebut;
    private LocalDate dateFinPrevue;
    private String marcheNumero; // on envoie juste le numéro

    // Getters & Setters
    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }
    public int getDureeMois() { return dureeMois; }
    public void setDureeMois(int dureeMois) { this.dureeMois = dureeMois; }
    public BigDecimal getPourcentageMontant() { return pourcentageMontant; }
    public void setPourcentageMontant(BigDecimal pourcentageMontant) { this.pourcentageMontant = pourcentageMontant; }
    public LocalDate getDateDebut() { return dateDebut; }
    public void setDateDebut(LocalDate dateDebut) { this.dateDebut = dateDebut; }
    public LocalDate getDateFinPrevue() { return dateFinPrevue; }
    public void setDateFinPrevue(LocalDate dateFinPrevue) { this.dateFinPrevue = dateFinPrevue; }
    public String getMarcheNumero() { return marcheNumero; }
    public void setMarcheNumero(String marcheNumero) { this.marcheNumero = marcheNumero; }
}