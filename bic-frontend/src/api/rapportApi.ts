import { axiosClient } from "./axiosClient";
import type { RapportSolvabilite } from "@/types/rapport";

const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080/api";

export const rapportApi = {
  obtenir: async (contratId: number): Promise<RapportSolvabilite> => {
    const { data } = await axiosClient.get<RapportSolvabilite>(`/rapports/contrat/${contratId}`);
    return data;
  },
  urlHtml: (contratId: number) => `${BASE}/rapports/contrat/${contratId}/html`,
  urlPdf: (contratId: number) => `${BASE}/rapports/contrat/${contratId}/pdf`,
};