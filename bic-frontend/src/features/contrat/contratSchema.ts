import { z } from "zod";

export const contratSchema = z.object({
  modeRattachement: z.enum(["NOUVELLE_DEMANDE", "DEMANDE_EXISTANTE", "ENTREPRISE"]),
  typeContrat: z.string().min(1, "Le type de contrat est requis"),
  roleClient: z.enum(["TITULAIRE", "CO_TITULAIRE", "GARANT"], { message: "Le rôle client est requis" }),
  dateDemande: z.string().min(1, "La date de la demande est requise"),
  montantFinance: z.coerce.number().positive("Le montant doit être positif"),
  montantEcheanceMensuelle: z.coerce.number().optional(),
  nombreTotalEcheances: z.coerce.number().int().positive("Le nombre d'échéances doit être positif"),
  devise: z.string().min(1),
  periodicitePaiement: z.string().optional(),
});

export type ContratFormValues = z.infer<typeof contratSchema>;
export type ContratFormInput = z.input<typeof contratSchema>;