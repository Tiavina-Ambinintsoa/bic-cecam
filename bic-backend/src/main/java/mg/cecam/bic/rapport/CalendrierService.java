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

import java.math.BigDecimal;
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
                    mois.add(new CelluleMoisDTO(MOIS_LABELS[m - 1], dansPeriode, null, null, dansPeriode ? "#E2E8F0" : "#FFFFFF"));
                    continue;
                }

                boolean ok = e.getStatut() == StatutEcheance.PAYE_A_TEMPS || e.getStatut() == StatutEcheance.A_VENIR;
                BigDecimal montantAffiche = e.getMontantPaye() != null ? e.getMontantPaye() : e.getMontantDu();
                mois.add(new CelluleMoisDTO(MOIS_LABELS[m - 1], true, montantAffiche, e.getStatut().name(), ok ? "#4CAF50" : "#E53935"));
            }
            lignes.add(new LigneAnneeDTO(annee, mois));
        }

        return new CalendrierCreditDTO(contrat.getCodeContratCb(), contrat.getTypeContrat(), contrat.getMontantFinance(), lignes);
    }
}