package mg.cecam.bic.rapport;

import lombok.RequiredArgsConstructor;
import mg.cecam.bic.common.enums.StatutEcheance;
import mg.cecam.bic.contrat.Contrat;
import mg.cecam.bic.contrat.Echeance;
import mg.cecam.bic.contrat.EcheanceRepository;
import mg.cecam.bic.rapport.dto.CalendrierCreditDTO;
import mg.cecam.bic.rapport.dto.CelluleMoisDTO;
import mg.cecam.bic.rapport.dto.LigneAnneeDTO;
import org.springframework.stereotype.Service;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendrierService {

    private static final String[] MOIS_LABELS =
            {"JAN", "FEV", "MAR", "AVR", "MAI", "JUN", "JUL", "AOU", "SEP", "OCT", "NOV", "DEC"};

    private final EcheanceRepository echeanceRepository;

    public CalendrierCreditDTO construire(Contrat contrat) {
    List<Echeance> echeances = echeanceRepository.findByContrat_IdOrderByNumeroEcheance(contrat.getId());
    if (echeances.isEmpty()) {
        return new CalendrierCreditDTO(contrat.getCodeContratCb(), contrat.getTypeContrat(), contrat.getMontantFinance(), List.of());
    }

    Map<YearMonth, Echeance> parMois = echeances.stream()
            .collect(Collectors.toMap(e -> YearMonth.from(e.getDateEcheance()), e -> e));

    YearMonth debut = YearMonth.from(contrat.getDateDemande());
    YearMonth fin = YearMonth.from(echeances.get(echeances.size() - 1).getDateEcheance());

    List<LigneAnneeDTO> lignes = new ArrayList<>();
    for (int annee = debut.getYear(); annee <= fin.getYear(); annee++) {
        List<CelluleMoisDTO> mois = new ArrayList<>();
        for (int m = 1; m <= 12; m++) {
            YearMonth courant = YearMonth.of(annee, m);
            boolean dansPeriode = !courant.isBefore(debut) && !courant.isAfter(fin);
            Echeance e = parMois.get(courant);

            if (!dansPeriode || e == null) {
                mois.add(new CelluleMoisDTO(MOIS_LABELS[m - 1], dansPeriode, null, null, "#FFFFFF"));
                continue;
            }

            // Rouge UNIQUEMENT si le statut est réellement EN_RETARD ou IMPAYE.
            // A_VENIR reste vert/neutre : ce n'est pas un retard tant que l'échéance n'est pas dépassée.
            boolean enIncident = e.getStatut() == StatutEcheance.EN_RETARD || e.getStatut() == StatutEcheance.IMPAYE;
            String couleur = enIncident ? "#E53935" : "#4CAF50";

            // Le montant ne s'affiche QUE s'il a réellement été remboursé ce mois (sinon case vide).
            mois.add(new CelluleMoisDTO(MOIS_LABELS[m - 1], true, e.getMontantPaye(), e.getStatut().name(), couleur));
        }
        lignes.add(new LigneAnneeDTO(annee, mois));
    }

    return new CalendrierCreditDTO(contrat.getCodeContratCb(), contrat.getTypeContrat(), contrat.getMontantFinance(), lignes);
}
}