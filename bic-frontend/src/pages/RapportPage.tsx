// src/pages/RapportPage.tsx
import { useParams } from "react-router-dom";

export function RapportPage() {
  const { contratId } = useParams<{ contratId: string }>();
  return (
    <div className="mx-auto max-w-xl p-6 text-slate-500">
      Rapport de solvabilité pour la demande #{contratId} — à construire (prochaine étape).
    </div>
  );
}