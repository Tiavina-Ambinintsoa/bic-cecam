import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { rapportApi } from "@/api/rapportApi";
import type { RapportSolvabilite } from "@/types/rapport";

export function RapportPage() {
  const { contratId } = useParams<{ contratId: string }>();
  const [rapport, setRapport] = useState<RapportSolvabilite | null>(null);

  useEffect(() => {
    if (!contratId) return;
    rapportApi.obtenir(Number(contratId)).then(setRapport);
  }, [contratId]);

  if (!rapport) {
    return <div className="mx-auto max-w-3xl p-6 text-slate-500">Chargement du rapport...</div>;
  }

  const statutOk = rapport.statutClient === "Client trouvé";

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Rapport de solvabilité</h2>
          <p className="text-sm text-slate-500">
            Requête du {new Date(rapport.dateRequete).toLocaleString("fr-FR")}
          </p>
        </div>
        <span className={cn(
          "rounded-full px-3 py-1 text-xs font-semibold text-white",
          statutOk ? "bg-green-600" : "bg-red-600"
        )}>
          {rapport.statutClient}
        </span>
      </div>

            <div className="flex gap-3">
        
          <a href={rapportApi.urlHtml(Number(contratId))}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          Visualiser PDF HTML
        </a>
        
          <a href={rapportApi.urlPdf(Number(contratId))}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "default" }))}
        >
          Visualiser PDF
        </a>
      </div>

      <Card>
        <CardHeader><CardTitle>Client</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 text-sm">
          <div><p className="text-slate-500">Code Client CB</p><p className="font-medium">{rapport.codeClientCb}</p></div>
          <div><p className="text-slate-500">Nom complet</p><p className="font-medium">{rapport.client.nomComplet}</p></div>
          <div><p className="text-slate-500">Genre</p><p className="font-medium">{rapport.client.genre === "FEMME" ? "Femme" : "Homme"}</p></div>
          <div><p className="text-slate-500">Catégorie Tiers</p><p className="font-medium">{rapport.client.categorieTiersCode}</p></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Score CB</CardTitle></CardHeader>
        <CardContent>
          {rapport.score.calculable ? (
            <div className="flex items-center gap-4">
              <div
                className="rounded-lg px-6 py-3 text-2xl font-bold text-white"
                style={{ backgroundColor: rapport.score.couleurHex }}
              >
                {rapport.score.valeur} — {rapport.score.intervalle}
              </div>
              <p className="font-medium text-slate-700">{rapport.score.categorieRisque}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-500">{rapport.score.message}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Synthèse</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div><p className="text-slate-500">Total contrats</p><p className="font-medium">{rapport.synthese.nombreTotalContrat}</p></div>
            <div><p className="text-slate-500">Établissements déclarants</p><p className="font-medium">{rapport.synthese.nombreEtablissementsDeclarants}</p></div>
            <div><p className="text-slate-500">Devise</p><p className="font-medium">{rapport.synthese.devise}</p></div>
            <div><p className="text-slate-500">Exposition potentielle</p><p className="font-medium">{rapport.synthese.expositionPotentielle}</p></div>
          </div>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b text-slate-500">
                <th className="py-1">Catégorie</th><th>Demandé</th><th>Refusé</th><th>Abandonné</th><th>Actif</th><th>Fermé</th>
              </tr>
            </thead>
            <tbody>
              {rapport.synthese.repartition.map((l) => (
                <tr key={l.categorie} className="border-b last:border-0">
                  <td className="py-1">{l.categorie}</td>
                  <td>{l.demande}</td><td>{l.refuse}</td><td>{l.abandonne}</td><td>{l.actif}</td><td>{l.ferme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}