// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField } from 'astro/config';
import { visualizer } from "rollup-plugin-visualizer";


import preact from "@astrojs/preact";


export default defineConfig({
    site: 'https://example.com',
    integrations: [sitemap(), preact({ compat: true })],
    env: {
        schema: {
            BASE_URL: envField.string({ context: "client", access: "public" }),
            API_TOKEN: envField.string({ context: "client", access: "public" }),
            BASE_GEOAPIFY_URL: envField.string({ context: "client", access: "public" }),
            GEOAPIFY_TOKEN: envField.string({ context: "client", access: "public" }),
        }
    },
    vite: {
        ssr: {
            noExternal: ['react-hook-form']
        },
        plugins: [visualizer({
            emitFile: true,
            filename: "stats.html",
        })]
    }
});