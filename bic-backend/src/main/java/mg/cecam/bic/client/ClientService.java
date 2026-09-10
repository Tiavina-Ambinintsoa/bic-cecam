package mg.cecam.bic.client;

import lombok.RequiredArgsConstructor;
import mg.cecam.bic.client.dto.ClientEnregistrementResponse;
import mg.cecam.bic.client.dto.ClientRequest;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClientService {

    private final ClientRepository clientRepository;

    @Transactional
public Client mettreAJour(Long id, ClientRequest request) {
    Client client = clientRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client introuvable"));
    client.setTitre(request.titre());
    client.setPrenom(request.prenom());
    client.setDeuxiemePrenom(request.deuxiemePrenom());
    client.setNom(request.nom());
    client.setDateNaissance(request.dateNaissance());
    client.setVilleNaissance(request.villeNaissance());
    client.setPaysNaissance(request.paysNaissance());
    client.setGenre(request.genre());
    client.setNationalite(request.nationalite());
    client.setEtatCivil(request.etatCivil());
    return clientRepository.save(client);
}

@Transactional
public Adresse ajouterAdresse(Long clientId, ClientRequest.AdresseRequest req) {
    Client client = clientRepository.findById(clientId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Client introuvable"));
    Adresse adresse = Adresse.builder()
            .client(client).typeAdresse(req.typeAdresse()).adresseComplete(req.adresseComplete())
            .numeroRue(req.numeroRue()).codePostal(req.codePostal()).ville(req.ville())
            .commune(req.commune()).region(req.region()).pays(req.pays())
            .build();
    clientRepository.save(client); // cascade ALL sur la relation persiste la nouvelle adresse
    client.getAdresses().add(adresse);
    return adresse;
}

    @Transactional
public ClientEnregistrementResponse enregistrerOuRecuperer(ClientRequest request) {
    String cin = request.identifiants().stream()
            .filter(i -> "CIN".equalsIgnoreCase(i.typeIdentifiant()))
            .map(ClientRequest.IdentifiantRequest::numero)
            .findFirst()
            .orElse(null);

    if (cin != null) {
        List<Client> existants = clientRepository.findAllByIdentifiants_NumeroAndIdentifiants_TypeIdentifiant(cin, "CIN");
        if (!existants.isEmpty()) {
            return new ClientEnregistrementResponse(existants.get(0), true);
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
            .findAllByIdentifiants_NumeroAndIdentifiants_TypeIdentifiant(numero, typeIdentifiant)
            .stream()
            .findFirst()
            .orElse(null);
}

    private String genererCodeClientCb() {
        return "L" + String.format("%08d", (long) (Math.random() * 100_000_000));
    }
}