import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // server: { // à retirer avant le push
  //   watch: {
  //     usePolling: true, // Utiliser le polling pour vérifier les changements de fichiers
  //     interval: 1000,   // Intervalle de polling en millisecondes
  //   },
  //   hmr: {
  //     overlay: true,   // Afficher une superposition sur les erreurs de HMR
  //   },
  // },
});
