# Monorepo Docs

- #### [how to add existing project](#how-to-add-existing-project)
- #### how to run
- #### how to install packs


## How to add existing project
### 1. craete an empty folder with app name at /apps

### 2. clone the project from it's repo in any

### 3 run
```cmd
cd apps/<app-name>
git clone <app-repo-path>
```

### 4. copy all folder content to the folder on step #1

### 5. update vite.config.ts 
```ts
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
      "yusr-ui": path.resolve(__dirname, "../../packages/yusr-ui/src/index.ts")
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime"]
  },
  optimizeDeps: {
    include: [
      "react-redux",
      "@reduxjs/toolkit",
      "use-sync-external-store",
      "use-sync-external-store/shim",
      "use-sync-external-store/shim/with-selector",
      "react-is"
    ]
  }
});

```

### 6. update tsconfig.app.json
put these on path section
```json
"@/*": ["./src/*"],
"yusr-core": ["../../packages/yusr-core/src/index.ts"],
"yusr-ui": ["../../packages/yusr-ui/src/index.ts"]
```

### 7. run 
```cmd
pnpm install
```
### 8. all done, jsut update the imports using your text editor
