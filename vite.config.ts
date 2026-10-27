import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    // Keep renderer dependencies behind the scene's dynamic import. Manually
    // grouping React/Three can hoist these into the initial preload graph.
    chunkSizeWarningLimit: 1200,
  },
});
