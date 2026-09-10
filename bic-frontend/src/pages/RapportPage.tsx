import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateFr } from "@/lib/dates";
import { rapportApi } from "@/api/rapportApi";
import type { RapportSolvabilite } from "@/types/rapport";

function buildMailHref(rapport: RapportSolvabilite, contratId: string) {
  const subject = encodeURIComponent(`Rapport de solvabilité — ${rapport.client.nomComplet}`);
  const body = encodeURIComponent(`Bonjour,\n\nLien du rapport de ${rapport.client.nomComplet} (${rapport.codeClientCb}) :\n${rapportApi.urlPdf(Number(contratId))}\n\nCordialement,`);
  return `mailto:?subject=${subject}&body=${body}`;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="mt-6 mb-2 rounded bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-800">{children}</div>;
}

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10.5px] tracking-wide text-slate-400">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value ?? "-"}</p>
    </div>
  );
}

const MOIS = ["JAN","FEV","MAR","AVR","MAI","JUN","JUL","AOU","SEP","OCT","NOV","DEC"];

export function RapportPage() {
  const { contratId } = useParams<{ contratId: string }>();
  const [rapport, setRapport] = useState<RapportSolvabilite | null>(null);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
  if (!contratId) return;
  let cancelled = false;

  rapportApi.obtenir(Number(contratId))
    .then((data) => { if (!cancelled) setRapport(data); })
    .catch(() => {
      if (!cancelled) {
        setErreur("Aucune demande trouvée pour cet identifiant. Vérifiez que c'est bien un ID de contrat (pas un ID client).");
      }
    });

  return () => { cancelled = true; };
}, [contratId]);

  if (erreur) return <div className="mx-auto max-w-xl p-6 text-red-600">{erreur}</div>;
  if (!rapport) return <div className="mx-auto max-w-3xl p-6 text-slate-500">Chargement du rapport...</div>;

  const statutOk = rapport.statutClient === "Client trouvé";

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-4 flex justify-end gap-3">
        <a href={buildMailHref(rapport, contratId!)} className={cn(buttonVariants({ variant: "outline" }))}>Envoyer par email</a>
        <a href={rapportApi.urlHtml(Number(contratId))} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline" }))}>Visualiser PDF HTML</a>
        <a href={rapportApi.urlPdf(Number(contratId))} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "default" }))}>Visualiser PDF</a>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">BIC — CECAM</p>
            <p className="text-sm text-slate-500">RAPPORT DE SOLVABILITÉ</p>
          </div>
          <div className="text-right text-[11px] text-slate-400">
            <p className="font-semibold text-slate-500">CONFIDENTIEL</p>
            <p>Réf. : {rapport.identifiantRapport}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <Field label="Date de la requête" value={formatDateFr(rapport.dateRequete)} />
          <div>
            <p className="text-[10.5px] tracking-wide text-slate-400">Statut</p>
            <span className={cn("mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold text-white", statutOk ? "bg-green-600" : "bg-red-600")}>
              {rapport.statutClient}
            </span>
          </div>
        </div>

        <SectionTitle>CLIENT</SectionTitle>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Code Client CB" value={rapport.codeClientCb} />
          <Field label="Date Dernière Modification" value={formatDateFr(rapport.client.dateDerniereModification)} />
          <Field label="Titre" value={rapport.client.titre} />
        </div>
        <div className="mt-3 grid grid-cols-4 gap-4">
          <Field label="Nom Complet" value={rapport.client.nomComplet} />
          <Field label="Prénom" value={rapport.client.prenom} />
          <Field label="Deuxième Prénom" value={rapport.client.deuxiemePrenom} />
          <Field label="Nom" value={rapport.client.nom} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-4">
          <Field label="Date de Naissance" value={formatDateFr(rapport.client.dateNaissance)} />
          <Field label="Ville de Naissance" value={rapport.client.villeNaissance} />
          <Field label="Pays de Naissance" value={rapport.client.paysNaissance} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-4">
          <Field label="Genre" value={rapport.client.genre === "FEMME" ? "Femme" : "Homme"} />
          <Field label="Nationalité" value={rapport.client.nationalite} />
          <Field label="État civil" value={rapport.client.etatCivil} />
        </div>

        <SectionTitle>ADRESSES</SectionTitle>
        {rapport.adressesActuelles.map((a, i) => (
          <div key={i} className="mb-3">
            <p className="mb-1 text-xs font-semibold text-slate-500">Actuelle - {a.typeAdresse}</p>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Adresse complète" value={a.adresseComplete} />
              <Field label="N° et nom de la rue" value={a.numeroRue} />
              <Field label="Code postal" value={a.codePostal} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4">
              <Field label="Ville" value={a.ville} />
              <Field label="Commune" value={a.commune} />
              <Field label="Région" value={a.region} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4">
              <Field label="Pays" value={a.pays} />
              <Field label="Date dernière modification" value={formatDateFr(a.dateDerniereModification)} />
            </div>
          </div>
        ))}

        <SectionTitle>NUMÉRO IDENTIFIANT</SectionTitle>
        <table className="w-full text-sm">
          <thead><tr className="text-left text-[10.5px] text-slate-400"><th className="pb-1">Type identifiant</th><th>Numéro identifiant</th></tr></thead>
          <tbody>
            {(rapport.identifiants ?? []).map((idf, i) => (
              <tr key={i}><td className="py-0.5 font-medium">{idf.typeIdentifiant}</td><td className="font-medium">{idf.numero}</td></tr>
            ))}
          </tbody>
        </table>

        <SectionTitle>DÉTAILS DE LA DEMANDE SAISIE</SectionTitle>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Code Contrat CB" value={rapport.detailDemande.codeContratCb} />
          <Field label="Rôle" value={rapport.detailDemande.role} />
          <Field label="Type de relation avec l'Entreprise" value={rapport.detailDemande.typeRelationEntreprise} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-4">
          <Field label="Type de contrat" value={rapport.detailDemande.typeContrat} />
          <Field label="Phase de la demande" value={rapport.detailDemande.phaseDemande} />
          <Field label="Devise" value={rapport.detailDemande.devise} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-4">
          <Field label="Périodicité de paiement" value={rapport.detailDemande.periodicitePaiement} />
          <Field label="Montant Financé" value={rapport.detailDemande.montantFinance} />
          <Field label="Montant Échéance Mensuelle" value={rapport.detailDemande.montantEcheanceMensuelle} />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-4">
          <Field label="Nombre Total Échéances" value={rapport.detailDemande.nombreTotalEcheances} />
          <Field label="Date de la Demande" value={formatDateFr(rapport.detailDemande.dateDemande)} />
        </div>

        <SectionTitle>DÉTAIL DU SCORE</SectionTitle>
        {rapport.score.calculable ? (
          <div className="flex items-center justify-between gap-6">
            <div className="space-y-1 text-sm">
              <p><span className="text-slate-400">Score : </span><span className="font-semibold">{rapport.score.valeur}</span></p>
              <p><span className="text-slate-400">Intervalle de score : </span><span className="font-semibold">{rapport.score.intervalle}</span></p>
              <p><span className="text-slate-400">Catégorie de score : </span><span className="font-semibold">{rapport.score.categorieRisque}</span></p>
            </div>
            <div className="flex items-end gap-2">
              {(rapport.grille ?? []).map((g) => {
                const actif = g.intervalle === rapport.score.intervalle;
                return (
                  <div key={g.intervalle} className="flex flex-col items-center gap-1">
                    <div className="rounded-lg transition-all" style={{ backgroundColor: g.couleurHex, width: actif ? 40 : 26, height: actif ? 40 : 26 }} />
                    <span className={cn("text-xs", actif ? "font-bold text-slate-900" : "text-slate-400")}>{g.intervalle}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-sm text-slate-500">Le score n'est pas calculé : {rapport.score.message}</p>
        )}

        <SectionTitle>SYNTHÈSE RAPPORT DE SOLVABILITÉ</SectionTitle>
        <p className="mb-2 text-xs font-semibold text-slate-500">Chiffres Clés</p>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <Field label="Nombre Total de Contrat" value={rapport.synthese.nombreTotalContrat} />
          <Field label="Montant Total Restant dû" value={rapport.synthese.montantTotalRestantDu} />
          <Field label="Nombre Établissements Déclarants" value={rapport.synthese.nombreEtablissementsDeclarants} />
          <Field label="Montant Total Impayés" value={rapport.synthese.montantTotalImpayes} />
          <Field label="Contrat manquant pour réciprocité" value={rapport.synthese.contratManquantReciprocite} />
          <Field label="Montant Total Demandes" value={rapport.synthese.montantTotalDemandes} />
          <Field label="Devise" value={rapport.synthese.devise} />
          <Field label="Total Garantie par Signature" value={rapport.synthese.totalGarantieSignature} />
          <Field label="Exposition Potentielle" value={rapport.synthese.expositionPotentielle} />
        </div>

        <p className="mb-2 mt-4 text-xs font-semibold text-slate-500">Répartition Contrats par Catégorie et Phase</p>
        <table className="w-full text-left text-xs">
          <thead><tr className="border-b text-slate-400"><th className="py-1">Catégorie</th><th>Demandé</th><th>Refusé</th><th>Abandonné</th><th>Actif</th><th>Fermé</th></tr></thead>
          <tbody>
            {(rapport.synthese.repartition ?? []).map((l) => (
              <tr key={l.categorie} className="border-b last:border-0"><td className="py-1">{l.categorie}</td><td>{l.demande}</td><td>{l.refuse}</td><td>{l.abandonne}</td><td>{l.actif}</td><td>{l.ferme}</td></tr>
            ))}
          </tbody>
        </table>

        {(rapport.calendriers ?? []).length > 0 && (
          <>
            <SectionTitle>CALENDRIER DE REMBOURSEMENT</SectionTitle>
            {rapport.calendriers.map((cal, i) => (
              <div key={i} className="mb-4">
                <p className="mb-2 text-xs font-semibold text-slate-500">Contrat {cal.codeContratCb} — {cal.typeContrat} ({cal.montantFinance} Ar)</p>
                <table className="w-full border-collapse text-center text-xs">
                  <thead><tr><th className="p-1 text-left">Année</th>{MOIS.map((m) => <th key={m} className="p-1">{m}</th>)}</tr></thead>
                  <tbody>
                    {cal.lignes.map((ligne) => (
                      <tr key={ligne.annee}>
                        <td className="p-1 text-left font-medium">{ligne.annee}</td>
                        {ligne.mois.map((c, j) => <td key={j} className="p-1" style={{ backgroundColor: c.couleurHex }}>{c.montant ?? ""}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </>
        )}

        <div className="mt-6 flex justify-between border-t pt-2 text-[10px] text-slate-400">
          <span>RAPPORT DE SOLVABILITÉ — BIC CECAM</span>
          <span>CONFIDENTIEL</span>
        </div>
      </div>
    </div>
  );
}