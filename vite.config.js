import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      ignored: ["**/*.mp4"],
    },
    proxy: {
      // Proxy /api/sharekhan → Sharekhan LLM endpoint (avoids browser CORS)
      "/api/sharekhan": {
        target: "https://mcpuat.sharekhan.com",
        changeOrigin: true,
        secure: true,
        rewrite: () => "/api/v1/chat/completions",
      },
    },
  },
});
