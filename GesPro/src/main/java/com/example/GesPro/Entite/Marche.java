package com.example.GesPro.Entite;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "marches")
public class Marche {
    @Id
    private String numero;
    private String type;
    private LocalDate dateNotification;
    private LocalDate dateDemarrage;
    private BigDecimal montantEstime;
    private String object;
    private String entrepriseNom;
    @OneToMany(mappedBy = "marche", fetch = FetchType.LAZY)
    private List<Phase> phases;

    // Getters & Setters
    public String getNumero() { return numero; }
    public String getObject() { return object; }
    public void setNumero(String numero) { this.numero = numero; }
    public void setObject(String numero) { this.object = numero; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDate getDateNotification() { return dateNotification; }
    public void setDateNotification(LocalDate dateNotification) { this.dateNotification = dateNotification; }
    public LocalDate getDateDemarrage() { return dateDemarrage; }
    public void setDateDemarrage(LocalDate dateDemarrage) { this.dateDemarrage = dateDemarrage; }
    public BigDecimal getMontantEstime() { return montantEstime; }
    public void setMontantEstime(BigDecimal montantEstime) { this.montantEstime = montantEstime; }
    public String getEntrepriseNom() {
        return entrepriseNom;
    }

    public void setEntrepriseNom(String entrepriseNom) {
        this.entrepriseNom = entrepriseNom;
    }
    public List<Phase> getPhases() {
        return phases;
    }

    public void setPhases(List<Phase> phases) {
        this.phases = phases;
    }

}