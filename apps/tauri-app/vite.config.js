import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
var host = process.env.TAURI_DEV_HOST;
var hmr = host ? { protocol: "ws", host: host, port: 1421 } : undefined;
// https://vite.dev/config/
export default defineConfig({
    plugins: [tsconfigPaths(), react(), tailwindcss()],
    // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
    // 1. prevent Vite from obscuring rust errors
    clearScreen: false,
    // 2. tauri expects a fixed port, fail if that port is not available
    server: {
        port: 1420,
        strictPort: true,
        host: host !== null && host !== void 0 ? host : false,
        hmr: hmr,
        watch: {
            // 3. tell Vite to ignore watching `src-tauri`
            ignored: ["**/src-tauri/**"],
        },
    },
});
