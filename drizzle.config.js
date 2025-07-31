import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./configs/schema.js",
  dialect: "postgresql",
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_dtyTbikx1j4J@ep-autumn-river-a155khvh-pooler.ap-southeast-1.aws.neon.tech/clip_pilot?sslmode=require&channel_binding=require",
  },
});
