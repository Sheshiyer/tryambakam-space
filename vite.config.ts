import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "./",
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "."),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          const normalizedId = id.split(path.sep).join("/");

          if (normalizedId.includes("/@react-three/") || normalizedId.includes("/three/")) {
            return "three-vendor";
          }

          if (normalizedId.includes("/gsap/")) {
            return "animation-vendor";
          }

          if (normalizedId.includes("/react/") || normalizedId.includes("/react-dom/")) {
            return "react-vendor";
          }

          return undefined;
        },
      },
    },
  },
});
