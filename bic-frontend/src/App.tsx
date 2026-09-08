import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TopBar } from "@/components/layout/TopBar";
import { ClientForm } from "@/features/client/ClientForm";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50">
        <TopBar />
        <Routes>
          <Route path="/" element={<ClientForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}