package mg.cecam.bic.rapport.dto;

public record AlerteDTO(Long clientId, String codeClientCb, String nomComplet, Long contratId,
                          String codeContratCb, long echeancesImpayees, long echeancesEnRetard) {}