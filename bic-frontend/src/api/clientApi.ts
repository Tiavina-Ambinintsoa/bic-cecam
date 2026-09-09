import { axiosClient } from "./axiosClient";
import type { ClientRequest, ClientResponse } from "@/types/client";

export interface ClientEnregistrementResponse {
  client: ClientResponse;
  clientTrouve: boolean;
}

export const clientApi = {
  creer: async (payload: ClientRequest): Promise<ClientEnregistrementResponse> => {
    const { data } = await axiosClient.post<ClientEnregistrementResponse>("/clients", payload);
    return data;
  },
  rechercherParCin: async (numero: string): Promise<ClientResponse | null> => {
    try {
      const { data } = await axiosClient.get<ClientResponse>("/clients/recherche", { params: { typeIdentifiant: "CIN", numero } });
      return data;
    } catch {
      return null;
    }
  },
};