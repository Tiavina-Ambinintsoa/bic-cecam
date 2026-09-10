package mg.cecam.bic.rapport;

import lombok.RequiredArgsConstructor;
import mg.cecam.bic.client.Client;
import mg.cecam.bic.common.enums.PhaseDemande;
import mg.cecam.bic.common.enums.StatutEcheance;
import mg.cecam.bic.contrat.Contrat;
import mg.cecam.bic.contrat.ContratRepository;
import mg.cecam.bic.contrat.EcheanceRepository;
import mg.cecam.bic.rapport.dto.AlerteDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class AlerteService {

    private final ContratRepository contratRepository;
    private final EcheanceRepository echeanceRepository;

    public List<AlerteDTO> lister() {
        return contratRepository.findAll().stream()
                .filter(c -> c.getPhaseDemande() == PhaseDemande.ACTIF)
                .map(this::toAlerte)
                .filter(Objects::nonNull)
                .toList();
    }

    private AlerteDTO toAlerte(Contrat c) {
        long impayees = echeanceRepository.findByContrat_IdOrderByNumeroEcheance(c.getId()).stream()
                .filter(e -> e.getStatut() == StatutEcheance.IMPAYE).count();
        long enRetard = echeanceRepository.findByContrat_IdOrderByNumeroEcheance(c.getId()).stream()
                .filter(e -> e.getStatut() == StatutEcheance.EN_RETARD).count();
        if (impayees == 0 && enRetard == 0) return null;
        Client client = c.getClient();
        return new AlerteDTO(client.getId(), client.getCodeClientCb(), client.getPrenom() + " " + client.getNom(),
                c.getId(), c.getCodeContratCb(), impayees, enRetard);
    }
}