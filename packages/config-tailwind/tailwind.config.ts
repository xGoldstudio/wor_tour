import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    fontFamily: {
      stylised: ["DM Serif Display", "serif"],
    },
    extend: {
      borderRadius: {
        sm: "3px",
      },
      keyframes: {
        collectable: {
          '0%, 100%': { transform: 'scale(100%)' },
          '50%': { transform: 'scale(102%)' },
        },
        shiny: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1000' },
        }
      },
      animation: {
        collectable: 'collectable 1s ease-in-out infinite',
      },
    },
  },
};
export default config;
