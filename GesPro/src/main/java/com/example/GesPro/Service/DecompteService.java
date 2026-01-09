package com.example.GesPro.Service;

import com.example.GesPro.Entite.Phase;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.properties.BaseDirection;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class DecompteService {

    public byte[] generateFullDecompte(Phase phase) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);

        // ON UTILISE .rotate() POUR LE MODE PAYSAGE (LANDSCAPE)
        Document document = new Document(pdf, PageSize.A4.rotate());

        // On augmente un peu les marges pour le format large
        document.setMargins(20, 40, 20, 40);
        // --- CHARGEMENT POLICE ---
        byte[] fontBytes = new ClassPathResource("fonts/arial.ttf").getInputStream().readAllBytes();
        PdfFont arabicFont = PdfFontFactory.createFont(fontBytes, PdfEncodings.IDENTITY_H);

        // ==========================================
        // PAGE 1 : RÉSUMÉ ADMINISTRATIF
        // ==========================================
        generatePage1(document, phase, arabicFont);
        document.add(new AreaBreak());

        // ==========================================
        // PAGE 2 : TABLEAU DES OUVRAGES
        // ==========================================
        generatePage2(document, phase, arabicFont);
        document.add(new AreaBreak());

        // ==========================================
        // PAGE 3 : RÉCAPITULATION ET SIGNATURES
        // ==========================================
        generatePage3(document, phase, arabicFont);

        document.close();
        return baos.toByteArray();
    }

    private void generatePage1(Document document, Phase phase, PdfFont font) {
        // En-tête ORMVAD
        Paragraph header = new Paragraph("MINISTERE DE L'AGRICULTURE DE LA PECHE MARITIME\nDU DEVELOPPEMENT RURAL ET DES EAUX ET FORETS\n****\nOFFICE REGIONAL DE MISE EN VALEUR AGRICOLE DES DOUKKALA")
                .setFontSize(8).setBold().setTextAlignment(TextAlignment.LEFT);
        document.add(header);

        document.add(new Paragraph("DEPARTEMENT DE LA PLANIFICATION & FINANCES").setFontSize(9).setBold().setTextAlignment(TextAlignment.CENTER).setMarginTop(10));

        // Infos Marché
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{30, 70})).useAllAvailableWidth().setMarginTop(15);
        addInfoRow(infoTable, "EXERCICE :", "2025");
        addInfoRow(infoTable, "MARCHE N° :", phase.getMarche().getNumero());
        addInfoRow(infoTable, "OBJET :", phase.getMarche().getObject());
        addInfoRow(infoTable, "TITULAIRE DU MARCHE :", phase.getMarche().getEntrepriseNom());
        document.add(infoTable);

        // Petit Tableau de calcul Page 1
// --- CALCULS (Exemple basés sur vos documents) ---
        double montantHT = 120000 ; // ex: 120 000,00
        double tva = montantHT * 0.20;         // ex: 24 000,00
        double totalTtcBrut = montantHT + tva; // ex: 144 000,00
        double retenue5 = montantHT * 0.05;    // ex: 6 000,00
        double montantNet = totalTtcBrut - retenue5; // ex: 138 000,00

// --- CRÉATION DU TABLEAU (3 colonnes) ---
        Table calcTable = new Table(UnitValue.createPercentArray(new float[]{50, 25, 25}))
                .setWidth(400)
                .setHorizontalAlignment(HorizontalAlignment.RIGHT)
                .setMarginTop(20);

// Ligne d'entête du petit tableau
        calcTable.addCell(new Cell().setBorder(Border.NO_BORDER)); // Case vide
        calcTable.addCell(new Cell().add(new Paragraph("TTC :").setBold()).setTextAlignment(TextAlignment.CENTER));
        calcTable.addCell(new Cell().add(new Paragraph("Dont TVA :").setBold()).setTextAlignment(TextAlignment.CENTER));

// Ligne 1 : Montant Net (Dû à l'entreprise)
        calcTable.addCell(new Cell().add(new Paragraph("MONTANT NET DU DECOMPTE : Dû à l'entreprise :").setBold().setFontSize(9)));
        calcTable.addCell(new Cell().add(new Paragraph(String.format("%,.2f", montantNet)).setTextAlignment(TextAlignment.RIGHT)));
        calcTable.addCell(new Cell().add(new Paragraph(String.format("%,.2f DHS", tva)).setTextAlignment(TextAlignment.RIGHT)));

// Ligne 2 : Pénalités (souvent 0,00)
        calcTable.addCell(new Cell().add(new Paragraph("Pénalités :").setFontSize(9)));
        calcTable.addCell(new Cell().add(new Paragraph("0,00").setTextAlignment(TextAlignment.RIGHT)));
        calcTable.addCell(new Cell().add(new Paragraph("0,00").setTextAlignment(TextAlignment.RIGHT)));

// Ligne 3 : Retenue à la Source (5%)
        calcTable.addCell(new Cell().add(new Paragraph("Retenue a la Source (5%)").setBold().setFontSize(9)));
        calcTable.addCell(new Cell().add(new Paragraph(String.format("%,.2f", retenue5)).setTextAlignment(TextAlignment.RIGHT)));
        calcTable.addCell(new Cell().add(new Paragraph("DHS").setTextAlignment(TextAlignment.RIGHT)));

// Ligne 4 : Total TTC Final
        calcTable.addCell(new Cell().add(new Paragraph("Total TTC :").setBold().setFontSize(9)));
        calcTable.addCell(new Cell().add(new Paragraph(String.format("%,.2f", montantNet)).setBold().setTextAlignment(TextAlignment.RIGHT)));
        calcTable.addCell(new Cell().add(new Paragraph(String.format("%,.2f DHS", tva)).setBold().setTextAlignment(TextAlignment.RIGHT)));

        document.add(calcTable);

        document.add(new Paragraph("\n\nDECOMPTE PROVISOIRE N° 1").setBold().setFontSize(14).setTextAlignment(TextAlignment.CENTER));
        document.add(new Paragraph("des ouvrages exécutés et des dépenses faites à la date du: 30/09/2025").setFontSize(9).setTextAlignment(TextAlignment.CENTER));
    }

    private void generatePage2(Document document, Phase phase, PdfFont font) {
        document.add(new Paragraph("DECOMPTE PROVISOIRE N° 1").setBold().setTextAlignment(TextAlignment.CENTER).setFontSize(16));

        // On peut maintenant donner plus de place à la colonne "INDICATIONS DES OUVRAGES"
        // Proportions : 50% pour la description, le reste pour les chiffres
        Table mainTable = new Table(UnitValue.createPercentArray(new float[]{50, 8, 8, 8, 11, 15})).useAllAvailableWidth().setMarginTop(10);

        String[] headers = {"INDICATIONS DES OUVRAGES", "N° PRIX", "UNITE", "QTÉ", "P.U (HT)", "MONTANT (HT)"};
        for(String h : headers) {
            mainTable.addHeaderCell(new Cell().add(new Paragraph(h).setBold().setFontSize(9).setTextAlignment(TextAlignment.CENTER)));
        }

        // Données de la phase
        mainTable.addCell(new Cell().add(new Paragraph(phase.getNom()).setFontSize(9)));
        mainTable.addCell(new Cell().add(new Paragraph("1")).setTextAlignment(TextAlignment.CENTER));
        mainTable.addCell(new Cell().add(new Paragraph("U")).setTextAlignment(TextAlignment.CENTER));
        mainTable.addCell(new Cell().add(new Paragraph("1.00")).setTextAlignment(TextAlignment.CENTER));
        mainTable.addCell(new Cell().add(new Paragraph(String.format("%,.2f", phase.getMarche().getMontantEstime()))).setTextAlignment(TextAlignment.RIGHT));
        mainTable.addCell(new Cell().add(new Paragraph(String.format("%,.2f", phase.getMarche().getMontantEstime()))).setTextAlignment(TextAlignment.RIGHT));

        document.add(mainTable);
    }

    private void generatePage3(Document document, Phase phase, PdfFont font) {
        document.add(new Paragraph("RECAPITULATION").setBold().setTextAlignment(TextAlignment.CENTER).setUnderline());

        // Tableau Récapitulatif (Page 3)
        Table recap = new Table(UnitValue.createPercentArray(new float[]{40, 20, 20, 20})).useAllAvailableWidth();
        recap.addHeaderCell("NATURE DES DEPENSES");
        recap.addHeaderCell("DEPENSES FAITES");
        recap.addHeaderCell("RETENUES");
        recap.addHeaderCell("RESTE");

        recap.addCell("Travaux terminés");
        recap.addCell("144 000,00");
        recap.addCell("-");
        recap.addCell("144 000,00");
        document.add(recap);

        // Signatures (Bas de page)
        Table signTable = new Table(UnitValue.createPercentArray(new float[]{50, 50})).useAllAvailableWidth().setMarginTop(50);
        signTable.addCell(createSignatureCell("Dressé par : Le Chef du BEMI/SI", "Signé: Brahim MESSAOUDI", TextAlignment.LEFT));
        signTable.addCell(createSignatureCell("Chef Service Informatique", "Signé: BARDAGUI HASNAA", TextAlignment.RIGHT));
        document.add(signTable);

        document.add(new Paragraph("\nArrêté par nous ordonnateur à la somme de :").setItalic());
        document.add(new Paragraph("CENT TRENTE HUIT MILLE DIRHAMS (T.T.C)").setBold().setTextAlignment(TextAlignment.CENTER));
    }

    // Utilitaires
    private void addInfoRow(Table table, String label, String value) {
        table.addCell(new Cell().add(new Paragraph(label).setBold()).setBorder(Border.NO_BORDER));
        table.addCell(new Cell().add(new Paragraph(value)).setBorder(Border.NO_BORDER));
    }

    private Cell createSignatureCell(String title, String name, TextAlignment align) {
        return new Cell().add(new Paragraph(title + "\n\n\n" + name).setFontSize(9))
                .setBorder(Border.NO_BORDER).setTextAlignment(align);
    }
}