// vite.config.ts (club)
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // allow overriding the backend in dev via .env: VITE_API_PROXY_TARGET=http://localhost:5000
  const API_TARGET = env.VITE_API_PROXY_TARGET || "http://localhost:5000";

  return {
    base: "", // ← IMPORTANT: app is served at /club in production
    server: {
      host: "::",
      port: 5175,          // dev port for club (change if you prefer 8080)
      strictPort: true,
      proxy: {
        "/api": {
          target: API_TARGET,
          changeOrigin: true,
          secure: false,
        },
        "/lovable-uploads": {
          target: API_TARGET,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      port: 5175,
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      sourcemap: true,
    },
  };
});
