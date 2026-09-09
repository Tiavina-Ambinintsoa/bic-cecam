package mg.cecam.bic.client.dto;

import mg.cecam.bic.client.Client;

public record ClientEnregistrementResponse(Client client, boolean clientTrouve) {}