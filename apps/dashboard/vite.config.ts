import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";

export default defineConfig({

  plugins: [
    react(),
  ],

  resolve: {

    alias: {

      "@": resolve(
        __dirname,
        "src",
      ),

    },

  },

  server: {

    port: 5174,

    open: true,

    proxy: {

      "/api": {

        target:
          "http://localhost:3000",

        changeOrigin: true,

      },

    },

  },

  preview: {

    port: 4174,

  },

  build: {

    target: "es2022",

    sourcemap: true,

    outDir: "dist",

    emptyOutDir: true,

  },

});
