import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { clientApi } from "@/api/clientApi";
import { contratApi } from "@/api/contratApi";
import type { ClientResponse } from "@/types/client";
import type { ContratResponse } from "@/types/contrat";

export function RechercheIndividuPage() {
  const [numero, setNumero] = useState("");
  const [client, setClient] = useState<ClientResponse | null>(null);
  const [contrats, setContrats] = useState<ContratResponse[]>([]);
  const [recherche, setRecherche] = useState(false);
  const [introuvable, setIntrouvable] = useState(false);

  async function rechercher() {
    setRecherche(true); setIntrouvable(false); setClient(null); setContrats([]);
    try {
      const found = await clientApi.rechercherParCin(numero);
      if (!found) { setIntrouvable(true); return; }
      setClient(found);
      setContrats(await contratApi.listerParClient(found.id));
    } finally { setRecherche(false); }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Card>
        <CardHeader><CardTitle>Recherche par individu</CardTitle></CardHeader>
        <CardContent className="flex items-end gap-3">
          <div className="flex-1 space-y-1.5">
            <Label>Numéro CIN</Label>
            <Input value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="Ex : 301021985001" />
          </div>
          <Button onClick={rechercher} disabled={!numero || recherche}>{recherche ? "Recherche..." : "Rechercher"}</Button>
        </CardContent>
      </Card>

      {introuvable && <p className="text-sm text-slate-500">Aucun client trouvé avec ce numéro CIN.</p>}

      {client && (
        <Card>
          <CardHeader><CardTitle>{client.prenom} {client.nom} — {client.codeClientCb}</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-500">{contrats.length} demande(s) dans son historique :</p>
            {contrats.map((c) => (
              <Link key={c.id} to={`/demande/rapport/${c.id}`} className="flex items-center justify-between rounded-md border p-3 text-sm hover:bg-slate-50">
                <span>{c.codeContratCb} — {c.typeContrat}</span>
                <span className="text-slate-500">{c.phaseDemande}</span>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}