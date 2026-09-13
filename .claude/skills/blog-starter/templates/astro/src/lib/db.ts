import { drizzle } from 'drizzle-orm/d1';
import * as schema from '../db/schema';

export type Db = ReturnType<typeof getDb>;

/** Construit l'instance Drizzle à partir du binding D1 (Astro.locals.runtime.env.DB). */
export function getDb(env: { DB: D1Database }) {
  return drizzle(env.DB, { schema });
}

export { schema };
