import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Relative asset URLs work both at a custom domain and under a GitHub
  // repository path such as username.github.io/repository/.
  base: "./",
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: "index.html",
        about: "about.html",
        vlog: "vlog.html",
        contact: "contact.html",
      },
    },
  },
});
