import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: "client", // 👉 wichtig: Vite sucht index.html jetzt in /client
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "client", "src/assets"),
    },
  },
  build: {
    outDir: "../dist", // 👉 build output wieder in /dist schreiben
    emptyOutDir: true,
  },
});
