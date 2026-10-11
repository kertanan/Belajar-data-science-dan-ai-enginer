/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Palet Vision UI: latar navy gelap, aksen biru
        navy: {
          900: "#0b1437", // latar paling gelap
          800: "#111c44", // latar kartu
          700: "#1b254b", // kartu sekunder / hover
          600: "#24315f",
        },
        brand: {
          400: "#4299e1",
          500: "#3b82f6",
          600: "#2563eb",
        },
        accent: {
          cyan: "#0ea5e9",
          teal: "#01b574", // sukses / Ready
          amber: "#ffb547", // peringatan / Retrying
          red: "#e31a1a", // gagal
          purple: "#7551ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 20px 27px 0 rgba(0, 0, 0, 0.25)",
        glow: "0 0 20px 0 rgba(59, 130, 246, 0.35)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #4299e1 0%, #2563eb 100%)",
        "card-gradient": "linear-gradient(127deg, rgba(27,37,75,0.9) 0%, rgba(17,28,68,0.9) 100%)",
        "page-gradient": "linear-gradient(159deg, #0b1437 0%, #111c44 100%)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "pulse-dot": "pulse-dot 1.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
