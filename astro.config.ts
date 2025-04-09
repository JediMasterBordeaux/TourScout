import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import partytown from '@astrojs/partytown';
import compress from 'astro-compress';
import icon from 'astro-icon';
import type { AstroIntegration } from 'astro';
import astrowind from './vendor/integration';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const whenExternalScripts = (items: AstroIntegration[]) =>
  import.meta.env.PROD ? items : [];

export default defineConfig({
  output: 'static',
  site: 'https://concertindustry.com',
  base: '/',

  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap(),
    mdx(),
    icon({
      include: {
        tabler: ['*'],
      },
    }),
    ...whenExternalScripts([partytown()]),
    compress({
      CSS: true,
      HTML: {
        'html-minifier-terser': {
          removeAttributeQuotes: false,
        },
      },
      Image: false,
      JavaScript: true,
      SVG: false,
      Logger: 1,
    }),
    astrowind(),
  ],

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
    domains: ['cdn.pixabay.com'],
  },

  markdown: {
    remarkPlugins: [],
    rehypePlugins: [],
  },

  vite: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, './src'),
      },
    },
  },
});
