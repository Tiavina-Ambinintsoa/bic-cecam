package mg.cecam.bic.client;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mg.cecam.bic.client.dto.ClientRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PostMapping
    public ResponseEntity<Client> creer(@Valid @RequestBody ClientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clientService.creerClient(request));
    }

    @GetMapping("/recherche")
    public ResponseEntity<Client> rechercher(@RequestParam String typeIdentifiant, @RequestParam String numero) {
        Client client = clientService.rechercherParIdentifiant(typeIdentifiant, numero);
        return client == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(client);
    }
}