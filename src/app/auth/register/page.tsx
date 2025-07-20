//Similaire à la page de login, rend le composant RegisterForm pour créer un nouveau compte

import type { Metadata } from "next";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new account",
  openGraph: {
    title: "Register | My App",
    description: "Create a new account on My App",
  },
};

export default function Register() {
  return <RegisterForm />;
}
