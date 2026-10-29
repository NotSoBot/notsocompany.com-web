import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';


// builds the pages (index.html, privacy.html + src/) into dist/, which the worker serves (see worker/index.ts)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // copied to dist/ as is: favicon.ico, for browsers (and discord etc) that don't read the svg icon
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      // one html per page, so each has its own title and metatags without the worker filling them in
      input: {
        index: 'index.html',
        privacy: 'privacy.html',
      },
      output: {
        // the logo effects are `effect.<hash>.webp` so their filenames don't give away the command names (like notsobot.com)
        assetFileNames: (asset) => {
          if (asset.originalFileNames.some((name) => name.startsWith('src/assets/logos/effects/'))) {
            return 'assets/effect.[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
});
