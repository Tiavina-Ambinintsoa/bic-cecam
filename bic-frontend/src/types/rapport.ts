export interface ClientInfo {
  titre?: string;
  nomComplet: string;
  dateNaissance: string;
  genre: "FEMME" | "HOMME";
  nationalite: string;
  etatCivil?: string;
  categorieTiersCode: string;
}

export interface Adresse { typeAdresse: string; adresseComplete: string; }

export interface Score {
  calculable: boolean;
  valeur?: number;
  intervalle?: string;
  categorieRisque?: string;
  couleurHex?: string;
  message?: string;
}

export interface RepartitionLigne {
  categorie: string; demande: number; refuse: number; abandonne: number; actif: number; ferme: number;
}

export interface Synthese {
  nombreTotalContrat: number;
  nombreEtablissementsDeclarants: number;
  devise: string;
  expositionPotentielle: string;
  repartition: RepartitionLigne[];
}

export interface RapportSolvabilite {
  identifiantRapport: string;
  dateRequete: string;
  statutClient: string;
  codeClientCb: string;
  client: ClientInfo;
  score: Score;
  synthese: Synthese;
}