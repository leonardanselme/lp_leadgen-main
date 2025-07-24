// src/components/ThumbnailAnalyzer.tsx - VERSION ÉQUILIBRÉE AVEC NICHES
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ButtonColorful } from "@/components/ui/button-colorful";
import {
  Upload,
  Loader2,
  Star,
  TrendingUp,
  Clock,
  RotateCcw,
  ChevronDown,
} from "lucide-react";

// Niches YouTube avec critères spécifiques
const YOUTUBE_NICHES = [
  {
    id: "gaming",
    label: "🎮 Gaming",
    description: "Jeux vidéo, streams, let's play",
    criteria: "Expressions vives, couleurs saturées, action visible",
  },
  {
    id: "education",
    label: "📚 Éducation",
    description: "Tutoriels, cours, explications",
    criteria: "Clarté, professionnalisme, éléments visuels didactiques",
  },
  {
    id: "lifestyle",
    label: "✨ Lifestyle",
    description: "Mode, beauté, vie quotidienne",
    criteria: "Esthétique soignée, personnalité, ambiance",
  },
  {
    id: "tech",
    label: "💻 Tech",
    description: "High-tech, reviews, unboxing",
    criteria: "Produits visibles, setup professionnel, modernité",
  },
  {
    id: "fitness",
    label: "💪 Fitness",
    description: "Sport, nutrition, bien-être",
    criteria: "Énergie, transformation, motivation",
  },
  {
    id: "entertainment",
    label: "🎬 Divertissement",
    description: "Comédie, réactions, challenges",
    criteria: "Expression marquée, émotion forte, fun",
  },
  {
    id: "business",
    label: "💼 Business",
    description: "Entrepreneur, finance, développement",
    criteria: "Professionnalisme, crédibilité, réussite",
  },
  {
    id: "cooking",
    label: "👨‍🍳 Cuisine",
    description: "Recettes, restaurants, food",
    criteria: "Appétence visuelle, couleurs chaudes, présentation",
  },
  {
    id: "travel",
    label: "✈️ Voyage",
    description: "Destinations, vlogs voyage",
    criteria: "Paysages, aventure, découverte",
  },
  {
    id: "other",
    label: "🎯 Autre",
    description: "Niche spécifique ou mixte",
    criteria: "Adaptation selon le contenu",
  },
];

interface AnalysisResult {
  score: number;
  analysis: string;
  suggestions: string[];
  metadata?: {
    processingTime: number;
    tokensUsed: number;
    estimatedCost: number;
    niche: string;
  };
}

export default function ThumbnailAnalyzer() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [selectedNiche, setSelectedNiche] = useState<string>("other");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>("");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Le fichier doit faire moins de 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image");
        return;
      }

      setError("");
      setImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image || !title.trim()) {
      setError("Veuillez ajouter une image et un titre");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("title", title);
      formData.append("niche", selectedNiche);

      const response = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }

      const analysis: AnalysisResult = await response.json();
      setResult(analysis);
    } catch (error) {
      console.error("Erreur:", error);
      setError(
        `Erreur: ${error instanceof Error ? error.message : "Analyse impossible"}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setImage(null);
    setImagePreview("");
    setTitle("");
    setError("");
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Bon";
    if (score >= 4) return "Moyen";
    return "À améliorer";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-blue-500";
    if (score >= 4) return "text-orange-500";
    return "text-red-500";
  };

  const selectedNicheData = YOUTUBE_NICHES.find((n) => n.id === selectedNiche);

  return (
    <div className="space-y-8">
      {/* Upload et configuration */}
      <div className="bg-white rounded-lg border border-[#d3d3d3] p-6">
        <h3 className="text-xl font-semibold text-[#282828] mb-6">
          📸 Votre miniature à analyser
        </h3>

        <div className="space-y-6">
          {/* Upload d'image */}
          <div>
            <label className="block text-sm font-medium text-[#282828] mb-3">
              Image de la miniature
            </label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-[#d3d3d3] rounded-lg p-8 text-center hover:border-[#cc0000] transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-12 h-12 text-[#606060] mb-4" />
                  <span className="text-lg text-[#282828] font-medium mb-2">
                    Cliquez pour uploader une image
                  </span>
                  <span className="text-[#606060] text-sm">
                    PNG, JPG, WEBP • Max 5MB
                  </span>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Miniature preview"
                  className="w-full max-w-md mx-auto rounded-lg border border-[#d3d3d3]"
                />
                <button
                  onClick={() => {
                    setImagePreview("");
                    setImage(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-[#282828] mb-3">
              Titre de la vidéo
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Entrez le titre de votre vidéo YouTube..."
              className="text-base"
            />
            <p className="text-xs text-[#606060] mt-2">
              {title.length}/100 caractères • Optimal: 40-60 caractères
            </p>
          </div>

          {/* Sélection de niche */}
          <div>
            <label className="block text-sm font-medium text-[#282828] mb-3">
              Niche / Catégorie de contenu
            </label>
            <div className="relative">
              <select
                value={selectedNiche}
                onChange={(e) => setSelectedNiche(e.target.value)}
                className="w-full p-3 border border-[#d3d3d3] rounded-lg text-base bg-white appearance-none pr-10 focus:outline-none focus:ring-2 focus:ring-[#cc0000] focus:border-transparent"
              >
                {YOUTUBE_NICHES.map((niche) => (
                  <option key={niche.id} value={niche.id}>
                    {niche.label} - {niche.description}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#606060] pointer-events-none" />
            </div>
            {selectedNicheData && (
              <p className="text-xs text-[#606060] mt-2">
                <strong>Critères spécifiques :</strong>{" "}
                {selectedNicheData.criteria}
              </p>
            )}
          </div>

          {/* Erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Bouton d'analyse */}
          <div>
            <ButtonColorful
              label={
                isAnalyzing ? "Analyse en cours..." : "🚀 Analyser ma miniature"
              }
              onClick={handleAnalyze}
              disabled={isAnalyzing || !image || !title.trim()}
              className="w-full h-12 text-base"
            />
          </div>
        </div>
      </div>

      {/* Loading */}
      {isAnalyzing && (
        <div className="bg-white rounded-lg border border-[#d3d3d3] p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#cc0000]" />
          <h3 className="text-lg font-semibold text-[#282828] mb-2">
            Analyse en cours...
          </h3>
          <p className="text-[#606060]">
            L'IA analyse votre miniature selon les critères de votre niche (
            {selectedNicheData?.label})
          </p>
        </div>
      )}

      {/* Résultats */}
      {result && (
        <div className="space-y-6">
          {/* Score principal */}
          <div className="bg-gradient-to-r from-[#cc0000] to-[#ff4444] rounded-lg p-8 text-white">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 mr-2" />
                <span className="text-4xl font-bold">{result.score}/10</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Score de Performance</h3>
              <div className="flex items-center justify-center text-lg">
                <TrendingUp className="w-5 h-5 mr-2" />
                <span className="font-medium">
                  {getScoreLabel(result.score)}
                </span>
              </div>

              {/* Métadonnées */}
              {result.metadata && (
                <div className="mt-4 text-sm opacity-75 border-t border-white/20 pt-4">
                  <div className="flex justify-center space-x-6">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {(result.metadata.processingTime / 1000).toFixed(1)}s
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Niche: {selectedNicheData?.label}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analyse détaillée */}
          <div className="bg-white rounded-lg border border-[#d3d3d3] p-6">
            <h4 className="text-lg font-semibold text-[#282828] mb-4 flex items-center">
              🎯 Analyse experte pour {selectedNicheData?.label}
            </h4>
            <div className="prose prose-gray max-w-none">
              <p className="text-[#282828] leading-relaxed text-base whitespace-pre-line">
                {result.analysis}
              </p>
            </div>
          </div>

          {/* Suggestions d'amélioration */}
          <div className="bg-white rounded-lg border border-[#d3d3d3] p-6">
            <h4 className="text-lg font-semibold text-[#cc0000] mb-4 flex items-center">
              💡 Recommandations spécifiques
            </h4>
            <div className="space-y-4">
              {result.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-[#f9f9f9] p-4 rounded border border-[#e0e0e0] border-l-4 border-l-[#cc0000]"
                >
                  <div className="flex items-start">
                    <span className="bg-[#cc0000] text-white text-xs font-bold px-2 py-1 rounded mr-3 mt-1 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-[#282828] leading-relaxed">
                      {suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center space-x-4">
            <ButtonColorful
              label="Nouvelle analyse"
              onClick={resetAnalysis}
              className="px-8"
            />
          </div>
        </div>
      )}
    </div>
  );
}
