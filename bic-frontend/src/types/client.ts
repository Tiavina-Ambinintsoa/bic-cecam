export type Genre = "FEMME" | "HOMME";

export interface ClientRequest {
  titre?: string;
  categorieTiersCode: string;
  prenom: string;
  deuxiemePrenom?: string;
  nom: string;
  dateNaissance: string;
  villeNaissance?: string;
  paysNaissance?: string;
  genre: Genre;
  nationalite: string;
  etatCivil?: string;
  adresses: { typeAdresse: string; adresseComplete: string }[];
  identifiants: { typeIdentifiant: string; numero: string }[];
}

export interface ClientResponse extends ClientRequest {
  id: number;
  codeClientCb: string;
}