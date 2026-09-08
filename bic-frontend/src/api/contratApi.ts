import { axiosClient } from "./axiosClient";
import type { ContratRequest, ContratResponse } from "@/types/contrat";

export const contratApi = {
  creer: async (payload: ContratRequest): Promise<ContratResponse> => {
    const { data } = await axiosClient.post<ContratResponse>("/contrats", payload);
    return data;
  },
};