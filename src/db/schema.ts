//Définit le schéma de base des données et test
//Ici on n´a qu´un schéma Users mais on va pouvoir en rajouter d´autres par la suite

//Ne pas utiliser le schéma users si on utilise déja auth/users de Supabase

import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

// export const usersTable = pgTable("users", {
//   id: integer().primaryKey().generatedAlwaysAsIdentity(),
//   name: varchar({ length: 255 }).notNull(),
//   age: integer().notNull(),
//   email: varchar({ length: 255 }).notNull().unique(),
// });
