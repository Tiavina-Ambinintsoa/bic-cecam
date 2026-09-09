import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { rapportApi } from "@/api/rapportApi";
import type { RapportSolvabilite } from "@/types/rapport";

function buildMailHref(rapport: RapportSolvabilite, contratId: string) {
  const subject = encodeURIComponent(`Rapport de solvabilité — ${rapport.client.nomComplet}`);
  const body = encodeURIComponent(
    `Bonjour,\n\nVoici le lien vers le rapport de solvabilité de ${rapport.client.nomComplet} (code client ${rapport.codeClientCb}) :\n${rapportApi.urlPdf(Number(contratId))}\n\nCordialement,`
  );
  return `mailto:?subject=${subject}&body=${body}`;
}

export function RapportPage() {
  const { contratId } = useParams<{ contratId: string }>();
  const [rapport, setRapport] = useState<RapportSolvabilite | null>(null);

  useEffect(() => {
    if (!contratId) return;
    rapportApi.obtenir(Number(contratId)).then(setRapport);
  }, [contratId]);

  if (!rapport) return <div className="mx-auto max-w-3xl p-6 text-slate-500">Chargement du rapport...</div>;

  const statutOk = rapport.statutClient === "Client trouvé";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Rapport de solvabilité</h2>
          <p className="text-sm text-slate-500">Requête du {new Date(rapport.dateRequete).toLocaleString("fr-FR")}</p>
        </div>
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold text-white", statutOk ? "bg-green-600" : "bg-red-600")}>
          {rapport.statutClient}
        </span>
      </div>

      <div className="flex gap-3">
        <a href={buildMailHref(rapport, contratId!)} className={cn(buttonVariants({ variant: "outline" }))}>Envoyer par email</a>
        <a href={rapportApi.urlHtml(Number(contratId))} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline" }))}>Visualiser PDF HTML</a>
        <a href={rapportApi.urlPdf(Number(contratId))} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "default" }))}>Visualiser PDF</a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-2">
          <CardHeader><CardTitle>Client</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div><p className="text-slate-500">Code Client CB</p><p className="font-medium">{rapport.codeClientCb}</p></div>
            <div><p className="text-slate-500">Nom complet</p><p className="font-medium">{rapport.client.nomComplet}</p></div>
            <div><p className="text-slate-500">Genre</p><p className="font-medium">{rapport.client.genre === "FEMME" ? "Femme" : "Homme"}</p></div>
            <div><p className="text-slate-500">Date de naissance</p><p className="font-medium">{rapport.client.dateNaissance}</p></div>
            <div><p className="text-slate-500">Nationalité</p><p className="font-medium">{rapport.client.nationalite}</p></div>
            <div><p className="text-slate-500">État civil</p><p className="font-medium">{rapport.client.etatCivil ?? "-"}</p></div>
          </CardContent>
        </Card>

        <Card className="p-2">
          <CardHeader><CardTitle>Détail du score</CardTitle></CardHeader>
          <CardContent>
            {rapport.score.calculable ? (
              <div className="flex items-center gap-4">
                <div className="rounded-lg px-6 py-3 text-2xl font-bold text-white" style={{ backgroundColor: rapport.score.couleurHex }}>
                  {rapport.score.valeur} — {rapport.score.intervalle}
                </div>
                <p className="font-medium text-slate-700">{rapport.score.categorieRisque}</p>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Le score n'est pas calculé : {rapport.score.message}</p>
            )}
          </CardContent>
        </Card>

        <Card className="p-2">
          <CardHeader><CardTitle>Adresses</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {rapport.adressesActuelles.map((a, i) => (
              <div key={i} className="rounded-md border p-3">
                <p className="mb-1 font-medium">{a.typeAdresse}</p>
                <p className="text-slate-600">{a.adresseComplete}</p>
                <p className="text-slate-500 text-xs mt-1">{a.ville ?? "-"}, {a.commune ?? "-"}, {a.region ?? "-"}, {a.pays ?? "-"}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="p-2">
          <CardHeader><CardTitle>Numéro identifiant</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            {rapport.identifiants.map((idf, i) => (
              <div key={i} className="flex justify-between border-b pb-1 last:border-0">
                <span className="text-slate-500">{idf.typeIdentifiant}</span>
                <span className="font-medium">{idf.numero}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="p-2 lg:col-span-2">
          <CardHeader><CardTitle>Détails de la demande saisie</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
            <div><p className="text-slate-500">Code Contrat CB</p><p className="font-medium">{rapport.detailDemande.codeContratCb}</p></div>
            <div><p className="text-slate-500">Rôle</p><p className="font-medium">{rapport.detailDemande.role}</p></div>
            <div><p className="text-slate-500">Type de contrat</p><p className="font-medium">{rapport.detailDemande.typeContrat}</p></div>
            <div><p className="text-slate-500">Phase</p><p className="font-medium">{rapport.detailDemande.phaseDemande}</p></div>
            <div><p className="text-slate-500">Montant financé</p><p className="font-medium">{rapport.detailDemande.montantFinance}</p></div>
            <div><p className="text-slate-500">Échéance mensuelle</p><p className="font-medium">{rapport.detailDemande.montantEcheanceMensuelle ?? "-"}</p></div>
            <div><p className="text-slate-500">Nombre échéances</p><p className="font-medium">{rapport.detailDemande.nombreTotalEcheances}</p></div>
            <div><p className="text-slate-500">Date de la demande</p><p className="font-medium">{rapport.detailDemande.dateDemande}</p></div>
          </CardContent>
        </Card>

        <Card className="p-2 lg:col-span-2">
          <CardHeader><CardTitle>Synthèse — Répartition Contrats par Catégorie et Phase</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div><p className="text-slate-500">Total contrats</p><p className="font-medium">{rapport.synthese.nombreTotalContrat}</p></div>
              <div><p className="text-slate-500">Établissements déclarants</p><p className="font-medium">{rapport.synthese.nombreEtablissementsDeclarants}</p></div>
              <div><p className="text-slate-500">Devise</p><p className="font-medium">{rapport.synthese.devise}</p></div>
              <div><p className="text-slate-500">Montant total demandes</p><p className="font-medium">{rapport.synthese.montantTotalDemandes}</p></div>
            </div>
            <table className="w-full text-left text-xs">
              <thead><tr className="border-b text-slate-500"><th className="py-1">Catégorie</th><th>Demandé</th><th>Refusé</th><th>Abandonné</th><th>Actif</th><th>Fermé</th></tr></thead>
              <tbody>
                {rapport.synthese.repartition.map((l) => (
                  <tr key={l.categorie} className="border-b last:border-0">
                    <td className="py-1">{l.categorie}</td><td>{l.demande}</td><td>{l.refuse}</td><td>{l.abandonne}</td><td>{l.actif}</td><td>{l.ferme}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card className="p-2 lg:col-span-2">
          <CardHeader><CardTitle>Calendrier de remboursement</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            {rapport.calendriers.length === 0 && <p className="text-sm text-slate-500">Aucun crédit antérieur pour ce client.</p>}
            {rapport.calendriers.map((cal, i) => (
              <div key={i}>
                <p className="mb-2 text-sm font-medium">Contrat {cal.codeContratCb} — {cal.typeContrat} ({cal.montantFinance} Ar)</p>
                <table className="w-full border-collapse text-center text-xs">
                  <thead>
                    <tr>
                      <th className="p-1">Année</th>
                      {["JAN","FEV","MAR","AVR","MAI","JUN","JUL","AOU","SEP","OCT","NOV","DEC"].map((m) => (
                        <th key={m} className="p-1">{m}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {cal.lignes.map((ligne) => (
                      <tr key={ligne.annee}>
                        <td className="p-1 font-medium">{ligne.annee}</td>
                        {ligne.mois.map((c, j) => (
                          <td key={j} className="p-1" style={{ backgroundColor: c.couleurHex }}>
                            {c.montant ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}