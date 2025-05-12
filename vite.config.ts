// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: '/gh-stats-visualizer/',
  resolve: {
    alias: {
      '@styles': path.resolve(__dirname, './src/styles.ts'),
      '@types': path.resolve(__dirname, './src/types.ts'),
    }
  },
  build: {
    // Improve cache busting configuration
    rollupOptions: {
      output: {
        // Ensure chunk files include content hash
        chunkFileNames: 'assets/chunk-[name].[hash].js',
        // Ensure entry point files include content hash
        entryFileNames: 'assets/[name].[hash].js',
        // Ensure asset files include content hash
        assetFileNames: (assetInfo) => {
          const fileName = assetInfo.name || '';
          
          if (/\.(gif|jpe?g|png|svg|webp)$/i.test(fileName)) {
            return 'assets/images/[name].[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(fileName)) {
            return 'assets/fonts/[name].[hash][extname]';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
    // Make sure source maps are generated correctly
    sourcemap: true,
  },
});