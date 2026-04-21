import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "yusr-core": path.resolve(__dirname, "../../packages/yusr-core/src/index.ts"),
      "yusr-ui": path.resolve(__dirname, "../../packages/yusr-ui/src/index.ts")
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"]
  }
});
