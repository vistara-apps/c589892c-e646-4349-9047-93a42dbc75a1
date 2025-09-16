import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design system color tokens from spec
        bg: "hsl(210, 30%, 10%)",
        accent: "hsl(160, 70%, 50%)",
        primary: "hsl(210, 70%, 50%)",
        surface: "hsl(210, 30%, 15%)",
        "text-primary": "hsl(210, 10%, 95%)",
        "text-secondary": "hsl(210, 10%, 75%)",
      },
      borderRadius: {
        lg: "16px",
        md: "10px",
        sm: "6px",
        full: "9999px",
      },
      spacing: {
        lg: "20px",
        md: "12px",
        sm: "8px",
        xl: "32px",
      },
      boxShadow: {
        card: "0 4px 12px hsla(0,0%,0%,0.2)",
        modal: "0 8px 24px hsla(0,0%,0%,0.3)",
      },
      transitionDuration: {
        200: "200ms",
        300: "300ms",
      },
    },
  },
  plugins: [],
};
export default config;
