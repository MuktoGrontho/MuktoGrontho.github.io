import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const books = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/books" }),
  schema: z.object({
    title: z.string(),
    titleEn: z.string(),
    author: z.string(),
    authorEn: z.string(),
    authorDeathYear: z.number(),
    genre: z.string(),
    genreEn: z.string(),
    yearPublished: z.number().optional(),
    status: z.enum(["planned", "in-progress", "published"]).default("planned"),
    source: z.string().url().optional(),
    coverColor: z.string().default("#8c6b5d"),
    priority: z.enum(["high", "normal"]).default("normal"),
  }),
});

export const collections = { books };
