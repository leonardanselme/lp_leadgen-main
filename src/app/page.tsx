import { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { ButtonColorful } from "@/components/ui/button-colorful";

// required by Nextra
export const metadata: Metadata = {
  title: "ShipFree",
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-[#f9f9f9]">
      <div className="max-w-3xl w-full space-y-12 text-center">
        <div className="space-y-6">
          <h1 className="text-6xl font-bold text-[#cc0000]">ThumbnailAI</h1>

          <p className="text-2xl font-medium text-[#282828]">
            Prédisez le succès de vos miniatures YouTube en 30 secondes
          </p>

          <p className="text-xl text-[#606060] max-w-2xl mx-auto leading-relaxed">
            Uploadez vos miniatures, obtenez instantanément un score viral, une
            estimation du CTR, et des recommandations actionnables pour
            maximiser vos vues.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto items-center justify-center">
          <Input
            type="email"
            placeholder="Votre email"
            className="bg-white border-[#d3d3d3] text-[#282828]"
          />
          <ButtonColorful
            label="Rejoindre la liste d'attente"
            className="w-full sm:w-auto shadow-md"
          />
        </div>

        <p className="text-xl font-bold text-[#cc0000]">
          Plus besoin de deviner, vous SAUREZ.
        </p>
      </div>
    </main>
  );
}
