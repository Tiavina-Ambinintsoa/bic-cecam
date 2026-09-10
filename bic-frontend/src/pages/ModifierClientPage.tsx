import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientApi } from "@/api/clientApi";
import type { ClientResponse } from "@/types/client";

export function ModifierClientPage() {
  const [numero, setNumero] = useState("");
  const [client, setClient] = useState<ClientResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [nouvelleAdresse, setNouvelleAdresse] = useState({ typeAdresse: "Individu - Adresse secondaire", adresseComplete: "" });

  async function rechercher() {
    const found = await clientApi.rechercherParCin(numero);
    setClient(found);
  }

  async function enregistrer() {
    if (!client) return;
    setSaving(true);
    try {
      await clientApi.mettreAJour(client.id, client);
      window.alert("Modifications enregistrées.");
    } finally {
      setSaving(false);
    }
  }

  async function ajouterAdresse() {
    if (!client || !nouvelleAdresse.adresseComplete) return;
    await clientApi.ajouterAdresse(client.id, nouvelleAdresse);
    setNouvelleAdresse({ typeAdresse: "Individu - Adresse secondaire", adresseComplete: "" });
    window.alert("Adresse ajoutée.");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Card>
        <CardHeader><CardTitle>Modifier un client</CardTitle></CardHeader>
        <CardContent className="flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <Label>Numéro CIN</Label>
            <Input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Ex : 301021985001" />
          </div>
          <Button onClick={rechercher} disabled={!numero}>Charger</Button>
        </CardContent>
      </Card>

      {client && (
        <>
          <Card>
            <CardHeader><CardTitle>{client.prenom} {client.nom} — {client.codeClientCb}</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5"><Label>Prénom</Label><Input value={client.prenom} onChange={(e) => setClient({ ...client, prenom: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Nom</Label><Input value={client.nom} onChange={(e) => setClient({ ...client, nom: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>Ville de naissance</Label><Input value={client.villeNaissance ?? ""} onChange={(e) => setClient({ ...client, villeNaissance: e.target.value })} /></div>
              <div className="space-y-1.5"><Label>État civil</Label><Input value={client.etatCivil ?? ""} onChange={(e) => setClient({ ...client, etatCivil: e.target.value })} /></div>
              <div className="col-span-2 flex justify-end">
                <Button onClick={enregistrer} disabled={saving}>{saving ? "Enregistrement..." : "Enregistrer les modifications"}</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ajouter une adresse</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Adresse complète</Label>
                <Input value={nouvelleAdresse.adresseComplete} onChange={(e) => setNouvelleAdresse({ ...nouvelleAdresse, adresseComplete: e.target.value })} />
              </div>
              <Button variant="outline" onClick={ajouterAdresse}>+ Ajouter cette adresse</Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}