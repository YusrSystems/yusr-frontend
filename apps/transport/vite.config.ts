import tailwindcss from "@tailwindcss/vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss(), basicSsl()],
  server: { port: 5173 },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "yusr-core": path.resolve(__dirname, "../../packages/yusr-core/src/index.ts"),
      "yusr-ui": path.resolve(__dirname, "../../packages/yusr-ui/src/index.ts"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
});