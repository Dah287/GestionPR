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
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;

import com.ibm.icu.text.ArabicShaping;
import com.ibm.icu.text.Bidi;


@Service
public class OdsService {




    private String fixArabic(String text) {
        try {
            ArabicShaping shaper = new ArabicShaping(
                    ArabicShaping.LETTERS_SHAPE | ArabicShaping.TEXT_DIRECTION_LOGICAL
            );
            String shaped = shaper.shape(text);

            Bidi bidi = new Bidi(shaped, Bidi.DIRECTION_RIGHT_TO_LEFT);
            return bidi.writeReordered(Bidi.DO_MIRRORING);
        } catch (Exception e) {
            return text;
        }
    }


    public byte[] generateOdsOfficiel(Phase phase) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf, PageSize.A4);
        document.setMargins(15, 35, 15, 35);

        // --- CHARGEMENT DE LA POLICE ARABE (Indispensable) ---
        PdfFont arabicFont;
        try {
            byte[] fontBytes = new ClassPathResource("fonts/arial.ttf").getInputStream().readAllBytes();
            // IDENTITY_H est l'encodage nécessaire pour l'Arabe/Unicode
            arabicFont = PdfFontFactory.createFont(fontBytes, PdfEncodings.IDENTITY_H);
        } catch (Exception e) {
            System.err.println("ERREUR : Police introuvable dans src/main/resources/fonts/arial.ttf");
            // Fallback si la police manque pour ne pas faire planter l'appli
            arabicFont = null;
        }

        // --- EN-TÊTE AVEC LOGOS ---
        Table headerTable = new Table(UnitValue.createPercentArray(new float[]{25, 50, 25})).useAllAvailableWidth();
        headerTable.setBorder(Border.NO_BORDER);

        // Logo Gauche (ORMVAD) - Inversion pour design moderne selon votre demande
        try {
            ClassPathResource resOrmva = new ClassPathResource("static/logo_green.png");
            if (resOrmva.exists()) {
                Image imgOrmva = new Image(ImageDataFactory.create(resOrmva.getURL())).setMaxWidth(60);
                headerTable.addCell(new Cell().add(imgOrmva).setBorder(Border.NO_BORDER).setHorizontalAlignment(HorizontalAlignment.LEFT));
            } else { headerTable.addCell(new Cell().setBorder(Border.NO_BORDER)); }
        } catch (Exception e) { headerTable.addCell(new Cell().setBorder(Border.NO_BORDER)); }

        // Texte Central avec Arabe
        Paragraph headerText = new Paragraph();
        if (arabicFont != null) {
            headerText.setFont(arabicFont); // On applique la police ici
        }

        headerText    .add(new Text(fixArabic("المملكة المغربية\n"))
                        .setFont(arabicFont)
                        .setBold()
                        .setFontSize(9))
                .add(new Text("\n"))
                .add(new Text("ROYAUME DU MAROC\n").setBold().setFontSize(8))
                .add(new Text("*********\n"))
                .add(new Text(fixArabic("وزارة الفلاحة والصيد البحري والتنمية القروية والمياه والغابات\n"))
                        .setFont(arabicFont)
                        .setFontSize(7))
                .add(new Text("\n"))
                .add(new Text("MINISTERE DE L'AGRICULTURE, DE LA PECHE MARITIME, DU\nDEVELOPPEMENT RURAL ET DES EAUX ET FORETS\n").setFontSize(7))
                .add(new Text("*********\n"))
                .add(new Text(fixArabic("المكتب الجهوي للاستثمار الفلاحي لدكالة\n"))
                        .setFont(arabicFont)
                        .setBold()
                        .setFontSize(8))
                .add(new Text("\n"))
                .add(new Text("OFFICE REGIONAL DE MISE EN VALEUR AGRICOLE DES DOUKKALA\n").setBold().setFontSize(8))
                .setTextAlignment(TextAlignment.CENTER);

        headerTable.addCell(new Cell().add(headerText).setBorder(Border.NO_BORDER));

        // Logo Droite (Génération Green)
        try {
            ClassPathResource resGreen = new ClassPathResource("static/logo_ormvad.png");
            if (resGreen.exists()) {
                Image imgGreen = new Image(ImageDataFactory.create(resGreen.getURL())).setMaxWidth(55);
                headerTable.addCell(new Cell().add(imgGreen).setBorder(Border.NO_BORDER).setHorizontalAlignment(HorizontalAlignment.RIGHT));
            } else { headerTable.addCell(new Cell().setBorder(Border.NO_BORDER)); }
        } catch (Exception e) { headerTable.addCell(new Cell().setBorder(Border.NO_BORDER)); }

        document.add(headerTable);

        // --- TITRE DU MARCHÉ ---
        //document.add(new Paragraph("\n"));
        document.add(new Paragraph("MARCHE N° " + phase.getMarche().getNumero())
                .setBold().setTextAlignment(TextAlignment.CENTER).setFontSize(12).setUnderline());
        document.add(new Paragraph(phase.getMarche().getObject().toUpperCase())
                .setBold().setTextAlignment(TextAlignment.CENTER).setFontSize(10).setMarginBottom(10));
        document.add(new Paragraph("ORDRE DE SERVICE\nN°02/" + phase.getDateDebut().getYear())
                .setBold().setTextAlignment(TextAlignment.CENTER).setFontSize(14).setUnderline());
        // --- CORPS DU DOCUMENT ---
        document.add(new Paragraph("\nOBJET : Commencement des prestations").setBold().setFontSize(11));

        // Dates Visa/Approbation
        Table datesTable = new Table(UnitValue.createPercentArray(new float[]{50, 50})).useAllAvailableWidth().setMarginTop(10);
        datesTable.addCell(new Cell().add(new Paragraph("Date de visa : Néant")).setBorder(Border.NO_BORDER));
        datesTable.addCell(new Cell().add(new Paragraph("Date d'approbation : " + phase.getMarche().getDateNotification()))
                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));
        document.add(datesTable);

        document.add(new Paragraph("\nJe soussigné : Directeur de l'ORMVA des Doukkala").setMarginTop(15));
        document.add(new Paragraph("En application des clauses du marché indiqué ci-dessus :").setBold().setMarginBottom(10));

        // --- BLOC INFORMATIONS (DESIGN FORMULAIRE) ---
        Table infoTable = new Table(UnitValue.createPercentArray(new float[]{20, 80})).useAllAvailableWidth();
        infoTable.addCell(createLabelCell("Donne à"));
        infoTable.addCell(createValueCell(": NOM_ENTREPRISE" )); // + phase.getMarche().getEntrepriseNom()

        infoTable.addCell(createLabelCell("Demeurant à"));
        infoTable.addCell(createValueCell(": ADRESSE_ENTREPRISE" ));//+ phase.getMarche().getEntrepriseAdresse()

        infoTable.addCell(createLabelCell("L'Ordre de"));
        infoTable.addCell(createValueCell(": Commencement des prestations, et ce à compter du : " +
                phase.getDateDebut().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
        document.add(infoTable);

        document.add(new Paragraph("N.B : Pour tout renseignement supplémentaire, veuillez contacter le Chef du Département de la Planification et des Finances.")
                .setFontSize(10).setMarginTop(20));

        document.add(new Paragraph("\nEl Jadida, le " + java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")))
                .setTextAlignment(TextAlignment.RIGHT).setBold());

        // --- ZONE DE SIGNATURES (STRUCTURE EXACTE IMAGE) ---
        Table signatureTable = new Table(UnitValue.createPercentArray(new float[]{40, 60})).useAllAvailableWidth().setMarginTop(30);

        // Bloc Gauche (VU)
        signatureTable.addCell(new Cell().add(new Paragraph("VU ET PRESENTE PAR").setBold().setUnderline().setFontSize(9))
                .setBorder(Border.NO_BORDER));

        // Bloc Droite (ENTREPRISE)
        signatureTable.addCell(new Cell().add(new Paragraph("SIGNATURE ET CACHET\nDE L'ENTREPRISE").setBold().setUnderline().setFontSize(9))
                .setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT));

        document.add(signatureTable);

        // Bloc Central (APPROUVE)
        Paragraph approuve = new Paragraph("\nAPPROUVE PAR :")
                .setBold().setUnderline().setFontSize(10).setTextAlignment(TextAlignment.CENTER).setMarginTop(20);
        document.add(approuve);

        document.close();
        return baos.toByteArray();
    }

    private Cell createLabelCell(String text) {
        return new Cell().add(new Paragraph(text).setBold()).setBorder(Border.NO_BORDER).setPaddingBottom(5);
    }
    private Cell createValueCell(String text) {
        return new Cell().add(new Paragraph(text)).setBorder(Border.NO_BORDER).setPaddingBottom(5);
    }
}