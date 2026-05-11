import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          blue: "#2CA5E0",
          "blue-dark": "#1A8BC7",
          "blue-light": "#EBF6FD",
          green: "#10B981",
          "green-light": "#ECFDF5",
          red: "#EF4444",
        },
        brand: {
          border: "#E5E7EB",
          "border-hover": "#D1D5DB",
          "border-focus": "#2CA5E0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "Consolas", "monospace"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        pill: "999px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.08)",
        md: "0 4px 12px rgba(0,0,0,0.08)",
        lg: "0 8px 24px rgba(0,0,0,0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
