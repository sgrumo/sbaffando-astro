// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig, envField } from 'astro/config';


export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	env: {
		schema: {
			BASE_URL: envField.string({ context: "client", access: "public" }),
			API_TOKEN: envField.string({ context: "client", access: "public" }),
		}
	}
});
