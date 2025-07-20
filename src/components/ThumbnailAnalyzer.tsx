// src/components/ThumbnailAnalyzer.tsx - VERSION ANALYSE QUALITATIVE
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { ButtonColorful } from "@/components/ui/button-colorful";
import {
  Upload,
  Loader2,
  Star,
  TrendingUp,
  Eye,
  User,
  Palette,
  Smartphone,
  Clock,
} from "lucide-react";

interface VisualFactors {
  facePresent: boolean;
  emotion: string;
  colorScheme: string;
  textCount: number;
  mobileFriendly: boolean;
  contrast: string;
}

interface AnalysisResult {
  score: number;
  ctrEstimate: string;
  analysis: string; // Nouvelle analyse textuelle
  visualFactors: VisualFactors; // Nouveaux facteurs visuels
  strengths: string[];
  improvements: string[]; // Changé de "weaknesses"
  suggestions: string[];
  metadata?: {
    processingTime: number;
    tokensUsed: number;
    estimatedCost: number;
    analysisType: string;
    imageSize: number;
  };
}

export default function ThumbnailAnalyzer() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [title, setTitle] = useState("");
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
        `Erreur: ${error instanceof Error ? error.message : "Erreur inconnue"}`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setImagePreview("");
    setTitle("");
    setResult(null);
    setError("");
  };

  // Fonction helper pour l'icône d'émotion
  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case "souriant":
        return "😊";
      case "choqué":
      case "surpris":
        return "😲";
      case "neutre":
        return "😐";
      case "absent":
        return "❌";
      default:
        return "🤔";
    }
  };

  // Fonction helper pour la couleur du schéma
  const getColorSchemeColor = (scheme: string) => {
    switch (scheme.toLowerCase()) {
      case "rouge-jaune":
        return "bg-gradient-to-r from-red-500 to-yellow-500";
      case "bleu-vert":
        return "bg-gradient-to-r from-blue-500 to-green-500";
      case "sombre":
        return "bg-gradient-to-r from-gray-800 to-gray-600";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
    }
  };

  return (
    <div className="space-y-8">
      {/* Zone d'upload */}
      <div className="bg-white rounded-lg border border-[#d3d3d3] p-8">
        <h3 className="text-xl font-semibold text-[#282828] mb-6">
          1. Uploadez votre miniature
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload zone */}
          <div>
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[#d3d3d3] rounded-lg cursor-pointer bg-[#f9f9f9] hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="max-h-48 max-w-full object-contain rounded"
                  />
                ) : (
                  <>
                    <Upload className="w-8 h-8 mb-4 text-[#606060]" />
                    <p className="mb-2 text-sm text-[#606060]">
                      <span className="font-semibold">
                        Cliquez pour uploader
                      </span>{" "}
                      ou glissez-déposez
                    </p>
                    <p className="text-xs text-[#606060]">
                      PNG, JPG, JPEG (MAX. 5MB)
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </label>
          </div>

          {/* Configuration zone */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#282828] mb-2">
                2. Titre de votre vidéo
              </label>
              <Input
                type="text"
                placeholder="Ex: CETTE ASTUCE VA CHANGER VOTRE VIE ! (incroyable)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-white border-[#d3d3d3] text-[#282828] h-12"
              />
            </div>

            <div className="text-sm text-[#606060]">
              <p className="mb-2">
                💡 <strong>Tips pour un bon titre :</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Utilisez des mots émotionnels</li>
                <li>Créez de la curiosité</li>
                <li>Restez entre 40-60 caractères</li>
                <li>Utilisez des MAJUSCULES avec parcimonie</li>
              </ul>
            </div>

            {/* Messages d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <ButtonColorful
              label={
                isAnalyzing
                  ? "Analyse experte en cours..."
                  : "🚀 Analyser ma miniature"
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
            Analyse experte en cours...
          </h3>
          <p className="text-[#606060]">
            L'IA analyse votre miniature selon les critères de performance
            YouTube
          </p>
        </div>
      )}

      {/* Résultats */}
      {result && (
        <div className="space-y-6">
          {/* Score principal avec métadonnées */}
          <div className="bg-gradient-to-r from-[#cc0000] to-[#ff4444] rounded-lg p-8 text-white">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <Star className="w-8 h-8 mr-2" />
                <span className="text-4xl font-bold">{result.score}/10</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Score de Performance</h3>
              <div className="flex items-center justify-center space-x-8 text-lg">
                <div className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  <span>CTR: {result.ctrEstimate}</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span>
                    {result.score >= 8
                      ? "Excellent"
                      : result.score >= 6
                        ? "Bon"
                        : "À améliorer"}
                  </span>
                </div>
              </div>

              {/* Métadonnées de performance */}
              {result.metadata && (
                <div className="mt-4 text-sm opacity-75 border-t border-white/20 pt-4">
                  <div className="flex justify-center space-x-6">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {(result.metadata.processingTime / 1000).toFixed(1)}s
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Analyse experte
                    </div>
                    <div>${result.metadata.estimatedCost.toFixed(5)}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Analyse textuelle experte */}
          {result.analysis && (
            <div className="bg-white rounded-lg border border-[#d3d3d3] p-6">
              <h4 className="text-lg font-semibold text-[#282828] mb-4 flex items-center">
                🎯 Analyse experte
              </h4>
              <p className="text-[#282828] leading-relaxed text-base">
                {result.analysis}
              </p>
            </div>
          )}

          {/* Facteurs visuels détectés */}
          {result.visualFactors && (
            <div className="bg-white rounded-lg border border-[#d3d3d3] p-6">
              <h4 className="text-lg font-semibold text-[#282828] mb-4 flex items-center">
                🔍 Facteurs visuels détectés
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">
                    Visage:{" "}
                    {result.visualFactors.facePresent ? "Présent" : "Absent"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {getEmotionIcon(result.visualFactors.emotion)}
                  </span>
                  <span className="text-sm">
                    Émotion: {result.visualFactors.emotion}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-4 h-4 rounded ${getColorSchemeColor(result.visualFactors.colorScheme)}`}
                  ></div>
                  <span className="text-sm">
                    Couleurs: {result.visualFactors.colorScheme}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">
                    Contraste: {result.visualFactors.contrast}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-4 h-4 text-green-500" />
                  <span className="text-sm">
                    Mobile:{" "}
                    {result.visualFactors.mobileFriendly
                      ? "Optimisé"
                      : "À améliorer"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    Texte: {result.visualFactors.textCount} mots
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Points forts et améliorations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Points forts */}
            <div className="bg-white rounded-lg border border-[#d3d3d3] p-6">
              <h4 className="text-lg font-semibold text-green-600 mb-4 flex items-center">
                ✅ Points forts
              </h4>
              <ul className="space-y-3">
                {result.strengths.map((strength, index) => (
                  <li key={index} className="text-[#282828] flex items-start">
                    <span className="text-green-500 mr-2 mt-1">•</span>
                    <span className="leading-relaxed">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Points à améliorer */}
            <div className="bg-white rounded-lg border border-[#d3d3d3] p-6">
              <h4 className="text-lg font-semibold text-orange-600 mb-4 flex items-center">
                ⚠️ Points à améliorer
              </h4>
              <ul className="space-y-3">
                {result.improvements.map((improvement, index) => (
                  <li key={index} className="text-[#282828] flex items-start">
                    <span className="text-orange-500 mr-2 mt-1">•</span>
                    <span className="leading-relaxed">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Suggestions d'amélioration */}
          <div className="bg-white rounded-lg border border-[#d3d3d3] p-6">
            <h4 className="text-lg font-semibold text-[#cc0000] mb-4 flex items-center">
              💡 Suggestions d'amélioration
            </h4>
            <div className="space-y-4">
              {result.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="bg-[#f9f9f9] p-4 rounded border border-[#e0e0e0] border-l-4 border-l-[#cc0000]"
                >
                  <p className="text-[#282828] leading-relaxed">{suggestion}</p>
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
