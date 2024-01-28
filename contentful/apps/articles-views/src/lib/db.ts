import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import * as schema from "./schema";

export const db = (url: string, authToken: string) =>
  drizzle(
    createClient({
      url,
      authToken,
    }),
    {
      schema,
    }
  );

export type DB = typeof db;
