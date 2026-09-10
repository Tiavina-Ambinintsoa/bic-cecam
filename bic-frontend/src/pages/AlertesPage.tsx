import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "@/api/axiosClient";

interface Alerte {
  clientId: number; codeClientCb: string; nomComplet: string;
  contratId: number; codeContratCb: string; echeancesImpayees: number; echeancesEnRetard: number;
}

export function AlertesPage() {
  const [alertes, setAlertes] = useState<Alerte[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient.get<Alerte[]>("/alertes").then((res) => setAlertes(res.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="mx-auto max-w-2xl p-6 text-slate-500">Chargement...</div>;

  return (
    <div className="mx-auto max-w-2xl space-y-4 p-6">
      <h2 className="text-lg font-semibold text-slate-900">Alertes — crédits en incident</h2>
      {alertes.length === 0 && <p className="text-sm text-slate-500">Aucune alerte pour le moment.</p>}
      {alertes.map((a) => (
        <Link key={a.contratId} to={`/demande/rapport/${a.contratId}`} className="block rounded-md border p-4 hover:bg-slate-50">
          <div className="flex items-center justify-between">
            <span className="font-medium">{a.nomComplet} — {a.codeClientCb}</span>
            <span className="text-xs text-slate-500">Contrat {a.codeContratCb}</span>
          </div>
          <div className="mt-1 flex gap-4 text-sm">
            {a.echeancesImpayees > 0 && <span className="text-red-600">{a.echeancesImpayees} échéance(s) impayée(s)</span>}
            {a.echeancesEnRetard > 0 && <span className="text-orange-600">{a.echeancesEnRetard} échéance(s) en retard</span>}
          </div>
        </Link>
      ))}
    </div>
  );
}