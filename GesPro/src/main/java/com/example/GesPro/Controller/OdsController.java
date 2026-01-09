package com.example.GesPro.Controller;

import com.example.GesPro.Entite.Phase;
import com.example.GesPro.Repository.PhaseRepository;
import com.example.GesPro.Service.OdsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/ods")
public class OdsController {

    @Autowired
    private PhaseRepository phaseRepository;
    @Autowired
    private OdsService odsService;

    @GetMapping("/generate/{phaseId}")
    public ResponseEntity<byte[]> downloadOds(@PathVariable Long phaseId) throws IOException {
        Phase phase = phaseRepository.findById(phaseId)
                .orElseThrow(() -> new RuntimeException("Phase non trouvée"));

        byte[] pdfContent = odsService.generateOdsOfficiel(phase);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "ODS_" + phase.getNom() + ".pdf");

        return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);
    }
}