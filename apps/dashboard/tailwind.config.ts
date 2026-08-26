import type { Config } from "tailwindcss";

const config: Config = {

  content: [

    "./index.html",

    "./src/**/*.{ts,tsx}",

  ],

  theme: {

    extend: {

      colors: {

        background: "#0B0F14",

        surface: "#111827",

        card: "#1A2332",

        border: "#2D3748",

        primary: "#3B82F6",

        success: "#22C55E",

        warning: "#F59E0B",

        danger: "#EF4444",

        text: "#E5E7EB",

        muted: "#94A3B8",

      },

    },

  },

  plugins: [],

};

export default config;
