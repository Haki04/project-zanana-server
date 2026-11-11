import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { resolve } from "node:path";

// Membuat __filename dan __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [tailwindcss()],
  publicDir: "public-assets",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        login: resolve(__dirname, "pages/login.html"),
        dashboard: resolve(__dirname, "pages/admin/index.html"),
        inventory: resolve(__dirname, "pages/inventory/index.html"),
        report: resolve(__dirname, "pages/report/index.html"),
        user: resolve(__dirname, "pages/users/index.html"),
        information: resolve(__dirname, "pages/users/information.html"),
        "input-pesanan": resolve(__dirname, "pages/users/input-pesanan.html"),
        kerusakan: resolve(__dirname, "pages/users/kerusakan.html"),
        pesanan: resolve(__dirname, "pages/users/pesanan.html"),
        profile: resolve(__dirname, "pages/users/profile.html"),
        purchase: resolve(__dirname, "pages/users/purchase.html"),
        rooms: resolve(__dirname, "pages/users/rooms.html"),
        "snacks-rooms": resolve(__dirname, "pages/users/snacks-room.html"),
        stocks: resolve(__dirname, "pages/users/stocks.html"),
      },
    },
  },
});
