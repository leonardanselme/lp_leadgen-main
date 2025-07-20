import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import type React from "react"; // Import React
import { cn } from "@/lib/utils";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ThumbnailAI",
  description:
    "Prédisez le succès de vos miniatures YouTube en 30 secondes. Obtenez instantanément un score viral, une estimation du CTR, et des recommandations actionnables.",
  keywords: [
    "thumbnail",
    "youtube",
    "miniature",
    "CTR",
    "analyse",
    "intelligence artificielle",
    "AI",
    "prédiction",
    "viral",
    "youtube analytics",
    "thumbnail analyzer",
    "youtube optimization",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={cn(
          bricolageGrotesque.className,
          "antialiased",
          "bg-[#f9f9f9]",
          "text-[#282828]"
        )}
      >
        {children}
      </body>
    </html>
  );
}
