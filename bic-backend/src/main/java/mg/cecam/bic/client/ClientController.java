package mg.cecam.bic.client;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mg.cecam.bic.client.dto.ClientRequest;
import mg.cecam.bic.client.dto.ClientResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import mg.cecam.bic.client.dto.ClientEnregistrementResponse;

@RestController
@RequestMapping("/api/clients")
@RequiredArgsConstructor
public class ClientController {

    private final ClientService clientService;

    @PutMapping("/{id}")
public ResponseEntity<Client> mettreAJour(@PathVariable Long id, @Valid @RequestBody ClientRequest request) {
    return ResponseEntity.ok(clientService.mettreAJour(id, request));
}

@PostMapping("/{id}/adresses")
public ResponseEntity<Adresse> ajouterAdresse(@PathVariable Long id, @RequestBody ClientRequest.AdresseRequest request) {
    return ResponseEntity.status(HttpStatus.CREATED).body(clientService.ajouterAdresse(id, request));
}

    @PostMapping
public ResponseEntity<ClientEnregistrementResponse> creer(@Valid @RequestBody ClientRequest request) {
    ClientEnregistrementResponse result = clientService.enregistrerOuRecuperer(request);
    return ResponseEntity.status(result.clientTrouve() ? HttpStatus.OK : HttpStatus.CREATED).body(result);
}       
    @GetMapping("/recherche")
    public ResponseEntity<ClientResponse> rechercher(
            @RequestParam String typeIdentifiant,
            @RequestParam String numero
    ) {
        Client client = clientService.rechercherParIdentifiant(
                typeIdentifiant,
                numero
        );

        if (client == null) {
            return ResponseEntity.notFound().build();
        }

        ClientResponse response = new ClientResponse(
                client.getId(),
                client.getCodeClientCb(),
                client.getTitre(),
                client.getCategorieTiersCode(),
                client.getPrenom(),
                client.getDeuxiemePrenom(),
                client.getNom(),
                client.getDateNaissance(),
                client.getVilleNaissance(),
                client.getPaysNaissance(),
                client.getGenre(),
                client.getNationalite(),
                client.getEtatCivil()
        );

        return ResponseEntity.ok(response);
    }
}