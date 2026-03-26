/**
 * Applies a SQL migration file directly against the Supabase Postgres database.
 *
 * Usage: npx tsx scripts/apply-migration.ts supabase/migrations/003_document_pipeline.sql
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import fs from "node:fs/promises";
import path from "node:path";
import postgres from "postgres";

async function main() {
  const sqlFile = process.argv[2];
  if (!sqlFile) {
    console.error("Usage: npx tsx scripts/apply-migration.ts <path-to-sql>");
    process.exit(1);
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error("Missing DATABASE_URL in .env.local");
    process.exit(1);
  }

  const fullPath = path.resolve(sqlFile);
  const sqlContent = await fs.readFile(fullPath, "utf-8");

  console.log(`Applying: ${sqlFile}`);

  const sql = postgres(dbUrl, { ssl: "require" });

  try {
    await sql.unsafe(sqlContent);
    console.log("✓ Migration applied successfully.");
  } catch (err) {
    console.error("✗ Migration failed:", err instanceof Error ? err.message : err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
