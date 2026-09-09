// CalendrierCreditDTO.java
package mg.cecam.bic.rapport.dto;

import java.math.BigDecimal;
import java.util.List;

public record CalendrierCreditDTO(String codeContratCb, String typeContrat, BigDecimal montantFinance, List<LigneAnneeDTO> lignes) {}