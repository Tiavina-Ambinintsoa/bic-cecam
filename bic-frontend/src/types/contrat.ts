export type ModeRattachement = "NOUVELLE_DEMANDE" | "DEMANDE_EXISTANTE" | "ENTREPRISE";
export type RoleClient = "TITULAIRE" | "CO_TITULAIRE" | "GARANT";

export interface ContratRequest {
  clientId: number;
  modeRattachement: ModeRattachement;
  typeContrat: string;
  roleClient: RoleClient;
  dateDemande: string;
  montantFinance: number;
  montantEcheanceMensuelle?: number;
  nombreTotalEcheances: number;
  devise: string;
  periodicitePaiement?: string;
}

export interface ContratResponse extends ContratRequest {
  id: number;
  codeContratCb: string;
  phaseDemande: string;
}