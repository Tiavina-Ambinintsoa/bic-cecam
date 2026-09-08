// RapportSolvabiliteResponse.java
package mg.cecam.bic.rapport.dto;

import java.time.LocalDateTime;
import java.util.List;

public record RapportSolvabiliteResponse(
        String identifiantRapport, LocalDateTime dateRequete, String statutClient, String codeClientCb,
        ClientInfoDTO client, List<AdresseDTO> adressesActuelles, List<AdresseDTO> adressesHistoriques,
        EmploiDTO emploi, List<LienClientDTO> liens, ScoreDTO score, SyntheseDTO synthese
) {}