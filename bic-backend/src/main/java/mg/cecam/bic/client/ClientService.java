package mg.cecam.bic.client;

import lombok.RequiredArgsConstructor;
import mg.cecam.bic.client.dto.ClientEnregistrementResponse;
import mg.cecam.bic.client.dto.ClientRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    @Transactional
    public ClientEnregistrementResponse enregistrerOuRecuperer(ClientRequest request) {
        String cin = request.identifiants().stream()
                .filter(i -> "CIN".equalsIgnoreCase(i.typeIdentifiant()))
                .map(ClientRequest.IdentifiantRequest::numero)
                .findFirst()
                .orElse(null);

        if (cin != null) {
            Optional<Client> existant = clientRepository.findByIdentifiants_NumeroAndIdentifiants_TypeIdentifiant(cin, "CIN");
            if (existant.isPresent()) {
                // Client déjà connu : on NE modifie PAS ses informations existantes.
                // Un seul code_client_cb reste attaché à ce CIN pour toute sa vie.
                return new ClientEnregistrementResponse(existant.get(), true);
            }
        }

        return new ClientEnregistrementResponse(creerClient(request), false);
    }

    private Client creerClient(ClientRequest request) {
        Client client = Client.builder()
                .codeClientCb(genererCodeClientCb())
                .titre(request.titre())
                .categorieTiersCode(request.categorieTiersCode())
                .prenom(request.prenom())
                .deuxiemePrenom(request.deuxiemePrenom())
                .nom(request.nom())
                .dateNaissance(request.dateNaissance())
                .villeNaissance(request.villeNaissance())
                .paysNaissance(request.paysNaissance())
                .genre(request.genre())
                .nationalite(request.nationalite())
                .etatCivil(request.etatCivil())
                .build();

        List<Adresse> adresses = request.adresses().stream()
                .map(a -> Adresse.builder()
                        .client(client).typeAdresse(a.typeAdresse()).adresseComplete(a.adresseComplete())
                        .numeroRue(a.numeroRue()).codePostal(a.codePostal()).ville(a.ville())
                        .commune(a.commune()).region(a.region()).pays(a.pays())
                        .build())
                .collect(Collectors.toList());
        client.setAdresses(adresses);

        List<Identifiant> identifiants = request.identifiants().stream()
                .map(i -> Identifiant.builder().client(client).typeIdentifiant(i.typeIdentifiant()).numero(i.numero()).build())
                .collect(Collectors.toList());
        client.setIdentifiants(identifiants);

        return clientRepository.save(client);
    }

    public Client rechercherParIdentifiant(String typeIdentifiant, String numero) {
        return clientRepository
                .findByIdentifiants_NumeroAndIdentifiants_TypeIdentifiant(numero, typeIdentifiant)
                .orElse(null);
    }

    private String genererCodeClientCb() {
        return "L" + String.format("%08d", (long) (Math.random() * 100_000_000));
    }
}