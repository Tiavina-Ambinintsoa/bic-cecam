package mg.cecam.bic.contrat;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mg.cecam.bic.contrat.dto.ContratRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contrats")
@RequiredArgsConstructor
public class ContratController {

    private final ContratService contratService;

    @PostMapping
    public ResponseEntity<Contrat> creer(@Valid @RequestBody ContratRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contratService.creerDemande(request));
    }

    @GetMapping
    public ResponseEntity<List<Contrat>> listerParClient(@RequestParam Long clientId) {
        return ResponseEntity.ok(contratService.listerParClient(clientId));
    }
}