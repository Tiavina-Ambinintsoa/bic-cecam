package mg.cecam.bic.score;

import lombok.RequiredArgsConstructor;
import mg.cecam.bic.client.Client;
import mg.cecam.bic.contrat.Contrat;
import mg.cecam.bic.contrat.ContratRepository;
import mg.cecam.bic.referentiel.GrilleScore;
import mg.cecam.bic.referentiel.GrilleScoreRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final ContratRepository contratRepository;
    private final GrilleScoreRepository grilleScoreRepository;

    private static final int SCORE_BASE = 500;

    public ScoreResult calculer(Client client, Contrat contratEnCours) {
        List<Contrat> historique = contratRepository.findByClient_Id(client.getId()).stream()
                .filter(c -> !c.getId().equals(contratEnCours.getId()))
                .toList();

        if (historique.isEmpty()) {
            return ScoreResult.nonCalculable("Ce client a été nouvellement créé dans le système");
        }

        int score = SCORE_BASE;
        for (Contrat c : historique) {
            score += switch (c.getPhaseDemande()) {
                case ACTIF -> 15;
                case FERME -> 25;
                case REFUSE -> -60;
                case ABANDONNE -> -40;
                case DEMANDE_EN_COURS -> 0;
            };
        }
        score = Math.max(300, Math.min(850, score));

        int scoreFinal = score;
        GrilleScore grille = grilleScoreRepository.findAll().stream()
                .filter(g -> scoreFinal >= g.getScoreMin() && scoreFinal <= g.getScoreMax())
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("Aucun intervalle ne couvre le score " + scoreFinal));

        return ScoreResult.calcule(score, grille.getIntervalle(), grille.getCategorieRisque(), grille.getCouleur());
    }
}