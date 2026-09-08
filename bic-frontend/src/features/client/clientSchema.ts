import { z } from "zod";

export const clientSchema = z.object({
  titre: z.string().optional(),
  categorieTiersCode: z.string().min(1, "La catégorie tiers est requise"),
  prenom: z.string().min(1, "Le prénom est requis"),
  deuxiemePrenom: z.string().optional(),
  nom: z.string().min(1, "Le nom est requis"),
  dateNaissance: z.string().min(1, "La date de naissance est requise"),
  villeNaissance: z.string().optional(),
  paysNaissance: z.string().optional(),
  genre: z.enum(["FEMME", "HOMME"], { message: "Le genre est requis" }),
  nationalite: z.string().min(1, "La nationalité est requise"),
  etatCivil: z.string().optional(),
  adresses: z
    .array(z.object({ typeAdresse: z.string().min(1), adresseComplete: z.string().min(1, "Adresse requise") }))
    .min(1),
  identifiants: z
    .array(z.object({ typeIdentifiant: z.string().min(1), numero: z.string().min(1, "Numéro requis") }))
    .min(1),
});

export type ClientFormValues = z.infer<typeof clientSchema>;