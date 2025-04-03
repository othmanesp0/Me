import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
      },
      backgroundImage: {
        "game-pattern": "url('/bg-pattern.svg'), linear-gradient(to bottom, #1a1a2e, #16213e)",
        "game-header": "linear-gradient(to right, rgba(180, 83, 9, 0.2), rgba(146, 64, 14, 0.2))",
        "game-card": "linear-gradient(to bottom, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8))",
      },
      boxShadow: {
        glow: "0 0 15px rgba(245, 158, 11, 0.3)",
        "glow-amber": "0 0 15px rgba(245, 158, 11, 0.5)",
        "glow-green": "0 0 15px rgba(16, 185, 129, 0.5)",
        "glow-blue": "0 0 15px rgba(59, 130, 246, 0.5)",
        "glow-purple": "0 0 15px rgba(139, 92, 246, 0.5)",
      },
      textShadow: {
        DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    ({ addUtilities }: { addUtilities: Function }) => {
      const newUtilities = {
        ".text-shadow": {
          textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
        },
        ".text-shadow-lg": {
          textShadow: "0 2px 5px rgba(0, 0, 0, 0.5)",
        },
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
        },
        ".scrollbar-thumb-amber-600": {
          "--scrollbar-thumb": "#d97706",
        },
        ".scrollbar-track-amber-900\\/30": {
          "--scrollbar-track": "rgba(120, 53, 15, 0.3)",
        },
      }
      addUtilities(newUtilities)
    },
  ],
}

export default config

