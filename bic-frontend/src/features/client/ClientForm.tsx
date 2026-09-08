import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientSchema, type ClientFormValues } from "./clientSchema";
import { clientApi } from "@/api/clientApi";

export function ClientForm() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nationalite: "Malgache",
      categorieTiersCode: "0215",
      adresses: [{ typeAdresse: "Individu - Adresse principale", adresseComplete: "" }],
      identifiants: [{ typeIdentifiant: "CIN", numero: "" }],
    },
  });

  const adressesArray = useFieldArray({ control: form.control, name: "adresses" });
  const identifiantsArray = useFieldArray({ control: form.control, name: "identifiants" });

  async function onSubmit(values: ClientFormValues) {
  setSubmitting(true);
  try {
    const client = await clientApi.creer(values);
    navigate(`/demande/nouvelle/contrat/${client.id}`);
  } finally {
    setSubmitting(false);
  }
}

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto max-w-3xl space-y-6 p-6">
      <Card>
        <CardHeader><CardTitle>Détails client</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Titre</Label>
            <Select onValueChange={(v) => form.setValue("titre", v as string)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Mr">Mr</SelectItem>
                <SelectItem value="Mme">Mme</SelectItem>
                <SelectItem value="Mademoiselle">Mademoiselle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* ---- Catégorie Tiers : défaut 0215 - IMF, libellé complet ---- */}
          <div className="space-y-1.5">
            <Label htmlFor="categorieTiersCode">
              Catégorie Tiers <span className="text-red-500">*</span>
            </Label>
            <Select
              defaultValue="0215"
              onValueChange={(v) => form.setValue("categorieTiersCode", v as string, { shouldValidate: true })}
            >
              <SelectTrigger id="categorieTiersCode">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Ménages / IMF</SelectLabel>
                  <SelectItem value="0004">0004 - Ménages</SelectItem>
                  <SelectItem value="0215">0215 - Institution de Micro-Finance (IMF)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Administrations publiques</SelectLabel>
                  <SelectItem value="0001">0001 - Administration publique</SelectItem>
                  <SelectItem value="0011">0011 - Administration centrale</SelectItem>
                  <SelectItem value="0019">0019 - NCA (non classé ailleurs)</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Institutions financières</SelectLabel>
                  <SelectItem value="0002">0002 - Institution financière</SelectItem>
                  <SelectItem value="0211">0211 - Banque Centrale</SelectItem>
                  <SelectItem value="0212">0212 - Banques / Établissements de crédit</SelectItem>
                  <SelectItem value="0213">0213 - Établissements financiers</SelectItem>
                  <SelectItem value="0214">0214 - Institutions financières spécialisées</SelectItem>
                  <SelectItem value="0022">0022 - Bureau de change</SelectItem>
                  <SelectItem value="0231">0231 - Assurances</SelectItem>
                  <SelectItem value="0023">0023 - Sociétés financières non établissement de crédit</SelectItem>
                  <SelectItem value="0232">0232 - Autres sociétés financières</SelectItem>
                  <SelectItem value="0029">0029 - Autres institutions financières</SelectItem>
                </SelectGroup>
                <SelectGroup>
                  <SelectLabel>Sociétés non financières</SelectLabel>
                  <SelectItem value="0003">0003 - Sociétés non financières</SelectItem>
                  <SelectItem value="0321">0321 - Sociétés non financières privées franches</SelectItem>
                  <SelectItem value="0322">0322 - Sociétés non financières privées non franches</SelectItem>
                  <SelectItem value="3221">3221 - Grandes entreprises</SelectItem>
                  <SelectItem value="3222">3222 - Petites et moyennes entreprises (PME)</SelectItem>
                  <SelectItem value="3223">3223 - Très petites entreprises (TPE)</SelectItem>
                  <SelectItem value="0329">0329 - NCA (non classé ailleurs)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {form.formState.errors.categorieTiersCode && (
              <p className="text-sm text-red-500">{form.formState.errors.categorieTiersCode.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Prénom <span className="text-red-500">*</span></Label>
            <Input {...form.register("prenom")} />
          </div>

          <div className="space-y-1.5">
            <Label>Deuxième Prénom</Label>
            <Input {...form.register("deuxiemePrenom")} />
          </div>

          <div className="space-y-1.5">
            <Label>Nom <span className="text-red-500">*</span></Label>
            <Input {...form.register("nom")} />
          </div>

          <div className="space-y-1.5">
            <Label>Date de naissance <span className="text-red-500">*</span></Label>
            <Input type="date" {...form.register("dateNaissance")} />
          </div>

          <div className="space-y-1.5">
            <Label>Ville de naissance</Label>
            <Input {...form.register("villeNaissance")} />
          </div>

          <div className="space-y-1.5">
            <Label>Pays de naissance</Label>
            <Input {...form.register("paysNaissance")} />
          </div>

          {/* ---- Genre : menu déroulant, vide par défaut ---- */}
          <div className="space-y-1.5">
            <Label htmlFor="genre">Genre <span className="text-red-500">*</span></Label>
            <Select onValueChange={(v) => form.setValue("genre", v as "FEMME" | "HOMME", { shouldValidate: true })}>
              <SelectTrigger id="genre">
                <SelectValue placeholder="Sélectionner" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FEMME">Femme</SelectItem>
                <SelectItem value="HOMME">Homme</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.genre && (
              <p className="text-sm text-red-500">{form.formState.errors.genre.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Nationalité <span className="text-red-500">*</span></Label>
            <Input {...form.register("nationalite")} />
          </div>

          <div className="space-y-1.5">
            <Label>État civil</Label>
            <Input {...form.register("etatCivil")} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Adresses</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {adressesArray.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Type d'adresse <span className="text-red-500">*</span></Label>
                <Select
                  defaultValue={field.typeAdresse}
                  onValueChange={(v) => form.setValue(`adresses.${index}.typeAdresse`, v as string)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Individu - Adresse principale">Individu - Adresse principale</SelectItem>
                    <SelectItem value="Individu - Adresse secondaire">Individu - Adresse secondaire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Adresse complète <span className="text-red-500">*</span></Label>
                <Input {...form.register(`adresses.${index}.adresseComplete` as const)} />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline"
            onClick={() => adressesArray.append({ typeAdresse: "Individu - Adresse secondaire", adresseComplete: "" })}>
            + Ajouter une adresse
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Identifiants</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {identifiantsArray.fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-1 gap-4 border-b pb-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Type identifiant <span className="text-red-500">*</span></Label>
                <Input {...form.register(`identifiants.${index}.typeIdentifiant` as const)} />
              </div>
              <div className="space-y-1.5">
                <Label>Numéro <span className="text-red-500">*</span></Label>
                <Input {...form.register(`identifiants.${index}.numero` as const)} />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline"
            onClick={() => identifiantsArray.append({ typeIdentifiant: "", numero: "" })}>
            + Ajouter un identifiant
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Enregistrement..." : "Continuer vers la demande"}
        </Button>
      </div>
    </form>
  );
}