import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
// https://vitejs.dev/config/
const manifestForPlugin = {
  workbox: {
    cleanupOutdatedCaches: true,
    skipWaiting: true,
  },
  server: {
    host: true,
  },
  registerType: "autoUpdate",
  injectRegister: "auto",
  devOptions: {
    enabled: false,
  },
  includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked.png"],
  manifest: {
    name: "Shri Gurunanak Hospital",
    short_name: "checkup-wala",
    theme_color: "#5a0c0c",
    background_color: "#5a0c0c",
    display: "standalone",
    scope: ".",
    start_url: ".",
    icons: [
      {
        src: "assets/images/maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "assets/images/logo512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "assets/images/logo192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "assets/images/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
      {
        src: "assets/images/logo32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "assets/images/logo16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
  },
};

export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugin)],
  build: {
    target: "es2021", // ✅ Supports BigInt
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "es2021", // ✅ Prevent esbuild from downgrading BigInt
    },
  },
});
