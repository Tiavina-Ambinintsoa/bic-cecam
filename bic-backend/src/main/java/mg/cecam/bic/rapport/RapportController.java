package mg.cecam.bic.rapport;

import lombok.RequiredArgsConstructor;
import mg.cecam.bic.rapport.dto.RapportSolvabiliteResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rapports/contrat/{contratId}")
@RequiredArgsConstructor
public class RapportController {

    private final RapportService rapportService;
    private final RapportPdfService rapportPdfService;

    @GetMapping
    public ResponseEntity<RapportSolvabiliteResponse> obtenir(@PathVariable Long contratId) {
        return ResponseEntity.ok(rapportService.construire(contratId));
    }

    @GetMapping(value = "/html", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> obtenirHtml(@PathVariable Long contratId) {
        return ResponseEntity.ok(rapportPdfService.genererHtml(rapportService.construire(contratId)));
    }

    @GetMapping(value = "/pdf", produces = MediaType.APPLICATION_PDF_VALUE)
    public ResponseEntity<byte[]> obtenirPdf(@PathVariable Long contratId) {
        byte[] pdf = rapportPdfService.genererPdf(rapportService.construire(contratId));
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=rapport-solvabilite.pdf")
                .body(pdf);
    }
}