// CelluleMoisDTO.java
package mg.cecam.bic.rapport.dto;

import java.math.BigDecimal;

public record CelluleMoisDTO(String mois, boolean dansPeriode, BigDecimal montant, String statut, String couleurHex) {}