import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import aspectRatio from "@tailwindcss/aspect-ratio";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background, #ffffff)", // Fallback to white
        foreground: "var(--foreground, #000000)", // Fallback to black
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"], // Example custom font
      },
    },
  },
  plugins: [
    forms,
    typography,
    aspectRatio,
  ],
} satisfies Config;
