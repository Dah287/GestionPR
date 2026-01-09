package com.example.GesPro.dto;


import java.math.BigDecimal;
import java.time.LocalDate;

public class MarcheRequest {
    private String numero;
    private String type;
    private LocalDate dateNotification;
    private LocalDate dateDemarrage;
    private BigDecimal montantEstime;

    // Getters & Setters
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDate getDateNotification() { return dateNotification; }
    public void setDateNotification(LocalDate dateNotification) { this.dateNotification = dateNotification; }
    public LocalDate getDateDemarrage() { return dateDemarrage; }
    public void setDateDemarrage(LocalDate dateDemarrage) { this.dateDemarrage = dateDemarrage; }
    public BigDecimal getMontantEstime() { return montantEstime; }
    public void setMontantEstime(BigDecimal montantEstime) { this.montantEstime = montantEstime; }
}