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
        button: {
          '0%, 100%': { transform: 'scale(100%)' },
          '50%': { transform: 'scale(110%)' },
        },
        shiny: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1000' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        }
      },
      animation: {
        collectable: 'collectable 1s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        button: 'button 0.4s ease-in',
      },
    },
  },
};
export default config;
