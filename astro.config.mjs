// @ts-check
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField, passthroughImageService } from 'astro/config';
import { visualizer } from "rollup-plugin-visualizer";


import preact from "@astrojs/preact";


import tailwindcss from "@tailwindcss/vite";


export default defineConfig({
    site: 'https://sbaffando.it',
    integrations: [sitemap(), preact({ compat: true })],
    env: {
        schema: {
            BASE_URL: envField.string({ context: "client", access: "public" }),
            API_TOKEN: envField.string({ context: "client", access: "public" }),
            BASE_GEOAPIFY_URL: envField.string({ context: "client", access: "public" }),
            GEOAPIFY_TOKEN: envField.string({ context: "client", access: "public" }),
        }
    },
    image: {
        service: passthroughImageService(),
    },
    vite: {
        ssr: {
            noExternal: ['react-hook-form'],
        },
        optimizeDeps: {
            esbuildOptions: {
                plugins: [
                    {
                        name: 'force-preact-compat-esbuild',
                        setup(build) {
                            const map = {
                                'react': 'preact/compat',
                                'react-dom': 'preact/compat',
                                'react/jsx-runtime': 'preact/jsx-runtime',
                                'react-dom/test-utils': 'preact/test-utils',
                            }
                            const filter = new RegExp('^(' + Object.keys(map).map(k => k.replace('/', '\\/')).join('|') + ')$')
                            build.onResolve({ filter }, args => {
                                return build.resolve(map[args.path], {
                                    kind: args.kind,
                                    resolveDir: args.resolveDir,
                                    importer: args.importer,
                                })
                            })
                        },
                    },
                ],
            },
        },
        plugins: [
            {
                name: 'force-preact-compat',
                enforce: 'pre',
                resolveId(source) {
                    if (source === 'react' || source === 'react-dom') {
                        return this.resolve('preact/compat')
                    }
                    if (source === 'react/jsx-runtime') {
                        return this.resolve('preact/jsx-runtime')
                    }
                    if (source === 'react-dom/test-utils') {
                        return this.resolve('preact/test-utils')
                    }
                    return null
                },
            },
            visualizer({
                emitFile: true,
                filename: "stats.html",
            }),
            tailwindcss(),
        ]
    },
    prefetch: true
});
