export interface ClientInfo {
  titre?: string; nomComplet: string; prenom: string; deuxiemePrenom?: string; nom: string;
  dateNaissance: string; villeNaissance?: string; paysNaissance?: string;
  genre: "FEMME" | "HOMME"; nationalite: string; etatCivil?: string;
  categorieTiersCode: string; dateDerniereModification: string;
}
export interface Adresse {
  typeAdresse: string; adresseComplete: string; numeroRue?: string; codePostal?: string;
  ville?: string; commune?: string; region?: string; pays?: string; dateDerniereModification: string;
}
export interface Identifiant { typeIdentifiant: string; numero: string; }
export interface DetailDemande {
  codeContratCb: string; role: string; typeRelationEntreprise?: string; typeContrat: string;
  phaseDemande: string; devise: string; periodicitePaiement?: string;
  montantFinance: number; montantEcheanceMensuelle?: number; nombreTotalEcheances: number; dateDemande: string;
}
export interface Score { calculable: boolean; valeur?: number; intervalle?: string; categorieRisque?: string; couleurHex?: string; message?: string; }
export interface RepartitionLigne { categorie: string; demande: number; refuse: number; abandonne: number; actif: number; ferme: number; }
export interface Synthese {
  nombreTotalContrat: number; nombreEtablissementsDeclarants: number; contratManquantReciprocite: string;
  devise: string; expositionPotentielle: string; montantTotalRestantDu: number;
  montantTotalDemandes: number; totalGarantieSignature: number; repartition: RepartitionLigne[];
}
export interface CelluleMois { mois: string; dansPeriode: boolean; montant?: number; statut?: string; couleurHex: string; }
export interface LigneAnnee { annee: number; mois: CelluleMois[]; }
export interface CalendrierCredit { codeContratCb: string; typeContrat: string; montantFinance: number; lignes: LigneAnnee[]; }

export interface GrilleScoreItem { intervalle: string; categorieRisque: string; couleurHex: string; }

export interface RapportSolvabilite {
  identifiantRapport: string; dateRequete: string; statutClient: string; codeClientCb: string;
  client: ClientInfo; adressesActuelles: Adresse[]; adressesHistoriques: Adresse[];
  identifiants: Identifiant[]; detailDemande: DetailDemande;
  score: Score; grille: GrilleScoreItem[]; synthese: Synthese; calendriers: CalendrierCredit[];
}