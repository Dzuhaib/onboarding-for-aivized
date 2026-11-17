import type { Config } from "tailwindcss";

const AIVIZED_INK = "215 22% 12%";
const AIVIZED_ORANGE = "16 60% 46%";
const AIVIZED_ORANGE_SOFT = "16 72% 66%";
const AIVIZED_BORDER = "34 18% 88%";
const AIVIZED_SURFACE = "38 38% 97%";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        border: { DEFAULT: "hsl(var(--border))" },
        input: { DEFAULT: "hsl(var(--input))" },
        ring: { DEFAULT: "hsl(var(--ring))" },
        background: { DEFAULT: "hsl(var(--background))" },
        foreground: { DEFAULT: "hsl(var(--foreground))" },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          soft: "hsl(var(--primary-soft))",
          muted: "hsl(var(--primary-muted))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          strong: "hsl(var(--surface-strong))",
          ink: "hsl(var(--surface-ink))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 2px hsl(215 22% 12% / 0.03), 0 12px 30px -18px hsl(215 22% 12% / 0.12)",
        lift: "0 2px 4px hsl(215 22% 12% / 0.03), 0 28px 60px -28px hsl(215 22% 12% / 0.2)",
        primary: "0 10px 30px -14px hsl(16 60% 46% / 0.45)",
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
