import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientSchema, type ClientFormValues } from "./clientSchema";
import { clientApi } from "@/api/ClientApi";

export function ClientForm() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      nationalite: "Malgache",
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
      console.log("Client créé :", client);
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
            <Select onValueChange={(v) => form.setValue("titre", v as string | undefined)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Mr">Mr</SelectItem>
                <SelectItem value="Mme">Mme</SelectItem>
                <SelectItem value="Mademoiselle">Mademoiselle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Catégorie Tiers <span className="text-red-500">*</span></Label>
            <Select onValueChange={(v) => form.setValue("categorieTiersCode", v as string)}>
              <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="0004">0004 - Ménages</SelectItem>
                <SelectItem value="0011">0011 - Administration centrale</SelectItem>
                <SelectItem value="0215">0215 - I M F</SelectItem>
                {/* compléter avec le référentiel complet §6.6 du cahier des charges */}
              </SelectContent>
            </Select>
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

          {/* ---- Champ Genre ---- */}
          <div className="space-y-1.5">
            <Label>Genre <span className="text-red-500">*</span></Label>
            <RadioGroup
              onValueChange={(v) => form.setValue("genre", v as "FEMME" | "HOMME")}
              className="flex gap-6 pt-1"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="FEMME" id="genre-femme" />
                <Label htmlFor="genre-femme" className="font-normal">Femme</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="HOMME" id="genre-homme" />
                <Label htmlFor="genre-homme" className="font-normal">Homme</Label>
              </div>
            </RadioGroup>
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