// src/app/api/analyze/route.ts - VERSION ÉQUILIBRÉE AVEC NICHES
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Configurations spécifiques par niche
const NICHE_CONFIGS = {
  gaming: {
    name: "Gaming",
    keyFactors:
      "expressions vives, couleurs saturées, action visible, gameplay recognizable",
    expectations: "émotions marquées, énergie, intensité visuelle",
    commonIssues: "surcharge d'effets, texte illisible, trop d'éléments",
  },
  education: {
    name: "Éducation",
    keyFactors:
      "clarté, professionnalisme, éléments visuels didactiques, crédibilité",
    expectations: "simplicité, lisibilité, sérieux professionnel",
    commonIssues:
      "manque de dynamisme, présentation fade, complexité excessive",
  },
  lifestyle: {
    name: "Lifestyle",
    keyFactors: "esthétique soignée, personnalité, ambiance, authenticité",
    expectations: "beauté visuelle, style personnel, émotions positives",
    commonIssues: "manque d'identité, surfilter, artifice trop visible",
  },
  tech: {
    name: "Tech",
    keyFactors: "produits visibles, setup professionnel, modernité, innovation",
    expectations: "netteté, produits reconnaissables, environnement tech",
    commonIssues:
      "produit pas assez visible, setup amateur, manque de modernité",
  },
  fitness: {
    name: "Fitness",
    keyFactors: "énergie, transformation, motivation, résultats visibles",
    expectations: "dynamisme, inspiration, progression visible",
    commonIssues: "manque d'énergie, statisme, résultats non visibles",
  },
  entertainment: {
    name: "Divertissement",
    keyFactors: "expression marquée, émotion forte, fun, surprise",
    expectations: "réaction visible, émotion intense, côté spectacle",
    commonIssues: "expression fade, manque d'émotion, banalité",
  },
  business: {
    name: "Business",
    keyFactors: "professionnalisme, crédibilité, réussite, sérieux",
    expectations: "autorité, expertise visible, environnement professionnel",
    commonIssues: "manque de crédibilité, amateurisme, promesses excessives",
  },
  cooking: {
    name: "Cuisine",
    keyFactors:
      "appétence visuelle, couleurs chaudes, présentation, gourmandise",
    expectations: "nourriture appétissante, couleurs vibrantes, envie",
    commonIssues:
      "plat peu appétissant, mauvais éclairage, présentation négligée",
  },
  travel: {
    name: "Voyage",
    keyFactors: "paysages, aventure, découverte, évasion",
    expectations: "beauté naturelle, dépaysement, expérience unique",
    commonIssues: "paysage fade, manque d'évasion, banalité touristique",
  },
  other: {
    name: "Généraliste",
    keyFactors: "adaptation au contenu, originalité, clarté du message",
    expectations: "cohérence avec le sujet, impact visuel",
    commonIssues: "manque de spécificité, message peu clair",
  },
};

export async function POST(request: NextRequest) {
  try {
    console.log("🚀 API analyze - Version équilibrée avec niches");

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "Configuration OpenAI manquante" },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const image = formData.get("image") as File;
    const title = formData.get("title") as string;
    const niche = (formData.get("niche") as string) || "other";

    if (!image || !title) {
      return NextResponse.json(
        { error: "Image et titre requis" },
        { status: 400 }
      );
    }

    if (image.size > 20 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image trop volumineuse (max 20MB)" },
        { status: 400 }
      );
    }

    console.log(`🎯 Analyse spécialisée pour la niche: ${niche}`);

    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    const nicheConfig =
      NICHE_CONFIGS[niche as keyof typeof NICHE_CONFIGS] || NICHE_CONFIGS.other;

    // Prompt équilibré et spécialisé par niche
    const balancedPrompt = `Tu es un expert YouTube spécialisé dans la niche ${nicheConfig.name}. 

TITRE: "${title}"
NICHE: ${nicheConfig.name}

Analyse cette miniature selon les standards spécifiques de cette niche :

CRITÈRES SPÉCIFIQUES POUR ${nicheConfig.name.toUpperCase()} :
• Facteurs clés attendus : ${nicheConfig.keyFactors}
• Standards de la niche : ${nicheConfig.expectations}  
• Problèmes courants : ${nicheConfig.commonIssues}

APPROCHE D'ANALYSE :
1. Score sur 10 basé sur l'efficacité pour cette niche spécifique
2. ÉQUILIBRE dans l'analyse : mentionner ce qui fonctionne ET ce qui peut être amélioré
3. Suggestions CONSTRUCTIVES et SPÉCIFIQUES à la niche
4. Éviter le ton excessivement critique - rester professionnel et bienveillant

CONSIGNES DE TON :
- Bienveillant mais honnête
- Constructif plutôt que destructif  
- Spécifique à la niche ${nicheConfig.name}
- Si la miniature est correcte, le dire clairement
- Ne pas inventer de problèmes s'il n'y en a pas de majeurs

Format JSON strict :
{
  "score": [1-10],
  "analysis": "Score X/10 pour votre miniature ${nicheConfig.name}. Points forts : [éléments qui fonctionnent bien]... Points d'amélioration : [éléments spécifiques à optimiser pour cette niche]... [évaluation équilibrée et constructive]",
  "suggestions": [
    "Suggestion 1 spécifique à la niche avec justification",
    "Suggestion 2 spécifique à la niche avec justification", 
    "Suggestion 3 spécifique à la niche avec justification"
  ]
}

Analyse cette miniature avec expertise mais bienveillance.`;

    console.log("🤖 Appel GPT-4o pour analyse équilibrée...");

    const startTime = Date.now();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: balancedPrompt },
            {
              type: "image_url",
              image_url: {
                url: `data:image/${image.type.split("/")[1]};base64,${base64Image}`,
                detail: "low",
              },
            },
          ],
        },
      ],
      max_tokens: 450,
      temperature: 0.3, // Plus déterministe pour cohérence
      top_p: 0.8,
    });

    const processingTime = Date.now() - startTime;

    const analysisText = response.choices[0].message.content;
    if (!analysisText) {
      throw new Error("Aucune réponse de OpenAI");
    }

    console.log("📊 Parsing analyse équilibrée...");

    let analysis;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const jsonText = jsonMatch ? jsonMatch[0] : analysisText;
      analysis = JSON.parse(jsonText);

      // Validation avec fallback constructif
      analysis = {
        score: Math.max(1, Math.min(10, parseInt(analysis.score) || 6)),
        analysis:
          analysis.analysis ||
          `Miniature analysée pour la niche ${nicheConfig.name}. L'analyse spécialisée permet d'identifier les optimisations spécifiques à votre domaine.`,
        suggestions: (analysis.suggestions || []).slice(0, 3),
      };
    } catch (parseError) {
      console.error("❌ Parsing error, fallback équilibré");

      // Fallback spécialisé par niche
      analysis = {
        score: 6,
        analysis: `Score 6/10 pour votre miniature ${nicheConfig.name}. Points forts : La miniature respecte les codes de base de votre niche. Points d'amélioration : Quelques optimisations peuvent améliorer l'impact spécifique aux attentes de votre audience ${nicheConfig.name.toLowerCase()}. L'analyse détaillée permettrait d'identifier les ajustements précis pour maximiser les performances.`,
        suggestions: [
          `Optimiser les éléments visuels selon les standards ${nicheConfig.name} : ${nicheConfig.keyFactors}`,
          `Renforcer l'impact émotionnel attendu dans la niche ${nicheConfig.name}`,
          `Ajuster la composition pour mieux correspondre aux attentes de votre audience ${nicheConfig.name.toLowerCase()}`,
        ],
      };
    }

    // Métadonnées avec info niche
    const tokensUsed = response.usage?.total_tokens || 0;
    const estimatedCost = tokensUsed * 0.0000025;

    const result = {
      ...analysis,
      metadata: {
        processingTime,
        tokensUsed,
        estimatedCost: Math.round(estimatedCost * 100000) / 100000,
        niche: nicheConfig.name,
      },
    };

    console.log(
      `✅ Analyse ${nicheConfig.name}: ${tokensUsed} tokens, ~$${estimatedCost.toFixed(5)}`
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("💥 Erreur analyse équilibrée:", error);

    if (error instanceof Error) {
      if (error.message.includes("insufficient_quota")) {
        return NextResponse.json(
          {
            error: "Quota OpenAI dépassé. Ajoutez des crédits pour continuer.",
          },
          { status: 402 }
        );
      }

      if (error.message.includes("rate_limit")) {
        return NextResponse.json(
          { error: "Limite de requêtes atteinte. Réessayez dans 1 minute." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erreur lors de l'analyse équilibrée" },
      { status: 500 }
    );
  }
}
