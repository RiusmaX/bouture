import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // « @/components/ui/button » plutôt que « ../../components/ui/button »
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  server: {
    // En développement, /api/... est relayé vers l'API : même origine, donc pas de CORS à gérer
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        rewrite: (url) => url.replace(/^\/api/, ''),
      },
    },
  },
});
