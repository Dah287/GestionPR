package com.example.GesPro.Controller;

import com.example.GesPro.Entite.Phase;
import com.example.GesPro.Repository.PhaseRepository; // Assurez-vous d'avoir ce repository
import com.example.GesPro.Service.DecompteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/decomptes")
@CrossOrigin("*") // Pour permettre les appels depuis le Frontend (Angular/React)
public class DecompteController {

    @Autowired
    private DecompteService decompteService;

    @Autowired
    private PhaseRepository phaseRepository;

    @GetMapping("/generate/{id}")
    public ResponseEntity<byte[]> downloadDecompte(@PathVariable Long id) {
        try {
            // 1. Récupérer la phase depuis la base de données
            Phase phase = phaseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Phase non trouvée avec l'ID : " + id));

            // 2. Générer le PDF de 3 pages via le Service
            byte[] pdfContent = decompteService.generateFullDecompte(phase);

            // 3. Préparer les headers pour le téléchargement
            String fileName = "Decompte_Provisoire_N1_" + phase.getMarche().getNumero().replace("/", "_") + ".pdf";

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfContent);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }
}