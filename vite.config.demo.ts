import { copyFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { defineConfig, type Plugin } from "vite";
import * as os from "node:os";

/**
 * Demo build: a single self-contained static page (dist-demo/) that boots the
 * real EnPassant UI against the in-process mock backend (src/demo). Relative
 * base so the output can be served from any path (e.g. /demo/ on the website
 * or the root of a GitHub branch fallback).
 */
function copyDemoWorker(): Plugin {
    return {
        name: "demo-copy-msw-worker",
        apply: "build",
        async closeBundle() {
            const outDir = resolve(import.meta.dirname, "./dist-demo/demo");
            await mkdir(outDir, { recursive: true });
            await copyFile(
                resolve(import.meta.dirname, "./demo/mockServiceWorker.js"),
                resolve(outDir, "mockServiceWorker.js"),
            );
        },
    };
}

export default defineConfig({
    base: "./",
    plugins: [
        tanstackRouter({
            target: "react",
        }),
        react(),
        babel({
            presets: [reactCompilerPreset()],
        }),
        copyDemoWorker(),
    ],
    server: {
        port: 1422,
        strictPort: true,
    },
    build: {
        outDir: "dist-demo",
        emptyOutDir: true,
        minify: "esbuild",
        sourcemap: false,
        target: "es2020",
        assetsDir: "demo/assets",
        rollupOptions: {
            input: {
                index: resolve(import.meta.dirname, "./demo/index.html"),
            },
        },
    },
    resolve: {
        alias: {
            "@": resolve(import.meta.dirname, "./src"),
        },
    },
    define: {
        "import.meta.env.VITE_PLATFORM": JSON.stringify(os.platform()),
    },
});
