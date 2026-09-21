import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ["react-router-dom", "react-router"],
    resolve: { conditions: ["module-sync", "module", "node"] },
  },
  build: { outDir: "../dist", emptyOutDir: true },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    hmr: { host: "127.0.0.1", clientPort: 5173 },
    proxy: { "/api": "http://localhost:5000" },
  },
  preview: { host: "127.0.0.1", port: 5174, strictPort: true },
});
