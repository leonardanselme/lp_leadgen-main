// src/app/mock_dashboard/page.tsx
import { Metadata } from "next";
import ThumbnailAnalyzer from "@/components/ThumbnailAnalyzer";

export const metadata: Metadata = {
  title: "Dashboard - ThumbnailAI",
  description: "Analysez vos miniatures YouTube avec l'IA",
};

export default function MockDashboard() {
  // Mock user pour le dev local
  const mockUser = {
    email: "dev@example.com",
    id: "mock-user-id",
  };

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      {/* Header Dashboard */}
      <header className="bg-white border-b border-[#d3d3d3] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#cc0000]">ThumbnailAI</h1>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-[#606060]">
              Dashboard • Version Beta (Dev Mode)
            </div>
            <div className="text-sm text-[#282828]">{mockUser.email}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-[#282828] mb-2">
            Analyseur de Miniatures
          </h2>
          <p className="text-[#606060] text-lg">
            Uploadez votre miniature et titre pour obtenir une analyse IA
            complète
          </p>
        </div>

        {/* Component principal d'analyse */}
        <ThumbnailAnalyzer />

        {/* Section statistiques (placeholder pour plus tard) */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-[#d3d3d3]">
            <h3 className="text-lg font-semibold text-[#282828] mb-2">
              Analyses réalisées
            </h3>
            <p className="text-3xl font-bold text-[#cc0000]">0</p>
            <p className="text-sm text-[#606060]">Cette session</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#d3d3d3]">
            <h3 className="text-lg font-semibold text-[#282828] mb-2">
              Score moyen
            </h3>
            <p className="text-3xl font-bold text-[#cc0000]">--</p>
            <p className="text-sm text-[#606060]">Vos miniatures</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-[#d3d3d3]">
            <h3 className="text-lg font-semibold text-[#282828] mb-2">
              Statut
            </h3>
            <p className="text-lg font-semibold text-green-600">Actif</p>
            <p className="text-sm text-[#606060]">Version Beta</p>
          </div>
        </div>

        {/* Dev Info Panel */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">
            🛠️ Mode Développement
          </h4>
          <p className="text-xs text-yellow-700">
            Cette page est accessible sans authentification. Une fois Supabase
            configuré, le contenu sera déplacé vers /dashboard avec protection
            auth.
          </p>
        </div>
      </main>
    </div>
  );
}
