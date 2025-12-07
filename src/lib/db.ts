import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const databaseUrl = process.env.DATABASE_URL;
const databaseAuthToken = process.env.DATABASE_AUTH_TOKEN;

export const db = (() => {
  if (!databaseUrl || !databaseAuthToken) {
    if (process.env.ARTICLE_PAGE_VIEWS_ENABLED === "true") {
      throw new Error(
        "Database credentials are required when ARTICLE_PAGE_VIEWS_ENABLED is true"
      );
    }

    return null;
  }

  const client = createClient({
    url: databaseUrl,
    authToken: databaseAuthToken,
  });

  return drizzle(client);
})();
