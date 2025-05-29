import { Pool } from "pg";
import { config } from "dotenv";
config();

// Ensure DATABASE_URL is present
if (!process.env.DATABASE_URL) {
  console.error("Environment variable DATABASE_URL is missing");
  process.exit(1);
}

// Create pool using DATABASE_URL
export const pool1 = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Needed for platforms like Railway, Supabase
  },
});

// Log on successful connection
pool1.on("connect", () => {
  console.log("Database pool connected successfully using DATABASE_URL.");
});

// Handle connection errors
pool1.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
  process.exit(1);
});
