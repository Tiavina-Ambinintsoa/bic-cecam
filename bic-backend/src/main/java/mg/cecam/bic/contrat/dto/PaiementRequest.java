package mg.cecam.bic.contrat.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record PaiementRequest(BigDecimal montantPaye, LocalDate datePaiement) {}