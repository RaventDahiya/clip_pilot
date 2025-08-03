import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  out: "./drizzle",
  schema: "./configs/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DRIZZLE_DATABASE_URL,
  },
});
