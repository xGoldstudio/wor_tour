import type { Config } from "tailwindcss";

// We want each package to be responsible for its own content.
const config: Omit<Config, "content"> = {
  theme: {
    fontFamily: {
      'stylised': ["DM Serif Display", "serif"],
    },
    extend: {
      borderRadius: {
        sm: "3px",
      },
    },
  },
};
export default config;