import { axiosClient } from "./axiosClient";
import type { ClientRequest, ClientResponse } from "@/types/client";

export const clientApi = {
  creer: async (payload: ClientRequest): Promise<ClientResponse> => {
    const { data } = await axiosClient.post<ClientResponse>("/clients", payload);
    return data;
  },
};