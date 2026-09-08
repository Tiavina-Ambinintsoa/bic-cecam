import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { HomeMenu } from "@/components/home/HomeMenu";
import { ClientForm } from "@/features/client/ClientForm";
import { ContratForm } from "@/features/contrat/ContratForm";
import { RapportPage } from "@/pages/RapportPage";
import { RechercheIndividuPage } from "@/pages/RechercheIndividuPage";
import { ModifierDemandePage } from "@/pages/ModifierDemandePage";
import { AlertesPage } from "@/pages/AlertesPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <TopBar />
        <Routes>
          <Route path="/" element={<HomeMenu />} />
          <Route path="/demande/nouvelle/individu" element={<ClientForm />} />
          <Route path="/demande/nouvelle/contrat/:clientId" element={<ContratForm />} />
          <Route path="/demande/rapport/:contratId" element={<RapportPage />} />
          <Route path="/recherche/individu" element={<RechercheIndividuPage />} />
          <Route path="/demande/modifier" element={<ModifierDemandePage />} />
          <Route path="/alertes" element={<AlertesPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}