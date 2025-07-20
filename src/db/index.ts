//Configure la connection a la Database via Drizzle ORM

import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});
export const db = drizzle({ client: pool });
