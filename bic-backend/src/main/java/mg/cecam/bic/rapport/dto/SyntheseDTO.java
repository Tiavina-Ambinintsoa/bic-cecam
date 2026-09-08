// SyntheseDTO.java
package mg.cecam.bic.rapport.dto;

import java.math.BigDecimal;
import java.util.List;

public record SyntheseDTO(
        int nombreTotalContrat, int nombreEtablissementsDeclarants, String contratManquantReciprocite,
        String devise, String expositionPotentielle, BigDecimal montantTotalRestantDu,
        BigDecimal montantTotalImpayes, int montantTotalDemandes, BigDecimal totalGarantieSignature,
        List<RepartitionLigneDTO> repartition
) {}