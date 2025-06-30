import type { Config } from "tailwindcss";
const { heroui } = require("@heroui/theme");

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui({
    themes: {
      light: {
        colors: {
          primary: {
            50: "#eff6ff",
            100: "#dbeafe",
            200: "#bfdbfe",
            300: "#93c5fd",
            400: "#60a5fa",
            500: "#3b82f6",
            600: "#2563eb",
            700: "#1d4ed8",
            800: "#1e40af",
            900: "#1e3a8a",
            DEFAULT: "#3b82f6",
            foreground: "#ffffff",
          },
          secondary: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a",
            DEFAULT: "#64748b",
            foreground: "#ffffff",
          },
        },
      },
      dark: {
        colors: {
          primary: {
            50: "#1e1b4b",
            100: "#312e81",
            200: "#3730a3",
            300: "#4338ca",
            400: "#5b21b6",
            500: "#7c3aed",
            600: "#8b5cf6",
            700: "#a78bfa",
            800: "#c4b5fd",
            900: "#e0e7ff",
            DEFAULT: "#7c3aed",
            foreground: "#ffffff",
          },
          secondary: {
            50: "#0f172a",
            100: "#1e293b",
            200: "#334155",
            300: "#475569",
            400: "#64748b",
            500: "#94a3b8",
            600: "#cbd5e1",
            700: "#e2e8f0",
            800: "#f1f5f9",
            900: "#f8fafc",
            DEFAULT: "#475569",
            foreground: "#ffffff",
          },
        },
      },
    },
  })],
};

export default config; 