// @ts-check
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://muktogrontho.github.io",
  output: "static",
  build: {
    assets: "_assets",
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
