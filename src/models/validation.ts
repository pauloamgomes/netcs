import { z } from "zod";

export const ArticleViewsSchema = z.object({
  slug: z.string(),
  ipAddress: z.string(),
  referer: z.string(),
  country: z.string(),
  device: z.string(),
  browser: z.string(),
});

export const NewsletterSignupsSchema = z.object({
  email: z.string().email(),
  country: z.string(),
});
