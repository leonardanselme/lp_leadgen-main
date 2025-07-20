//Layout partagé par toutes les pages d´auth: login, confirm, register
  //Si authentifié: redirige vers le tableau de bord, sinon affiche login/register

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();



  if (user) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
