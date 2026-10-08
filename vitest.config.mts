import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
  test: {
    include: ["tests/**/*.test.ts"],
    // A live address, so the tests see the site as it is once launched.
    env: { SITE_URL: "https://www.example.com", CONTACT_EMAIL: "" },
  },
});
