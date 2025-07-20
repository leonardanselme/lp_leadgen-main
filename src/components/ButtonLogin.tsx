"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function ButtonLogin(props: { className?: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();
      setUser(currentUser);
      setLoading(false);
    };

    fetchUser();

    // Écouter les changements d'état d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false); // Mettre à jour l'état de chargement ici aussi
      }
    );

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]); // Inclure supabase dans les dépendances

  // Afficher un état de chargement ou un bouton désactivé pendant la vérification
  if (loading) {
    return (
      <button
        className={`bg-gray-400 text-white py-2 px-4 rounded-full cursor-not-allowed ${props.className || ""}`}
        disabled
      >
        Chargement...
      </button>
    );
  }

  const href = user ? "/dashboard" : "/auth/login"; // Ajuster le chemin si nécessaire
  const text = user ? "Dashboard" : "Login";

  return (
    <Link
      href={href}
      className={`bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-300 ease-in-out ${props.className || ""}`}
    >
      {text}
    </Link>
  );
}
