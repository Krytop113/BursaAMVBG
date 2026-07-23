import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "src/prisma/schema.prisma",
  migrations: {
    path: "src/prisma/migrations",
    seed: "npx tsx src/prisma/seeds/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
