import { fileURLToPath } from 'node:url';
import { visualizer as rollupVisualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import { checker as typeChecker } from 'vite-plugin-checker';

// Vite Docs: https://vitejs.dev/guide/why.html
// Awesome Vite: https://github.com/vitejs/awesome-vite?tab=readme-ov-file
// Rollup Docs: https://rollupjs.org/introduction/
// Awesome Rollup: https://github.com/rollup/awesome

export default defineConfig({
  base: './',
  server: {
    host: '127.0.0.1',
    port: 8080,
  },
  assetsInclude: ['**/*.ttf'],
  build: {
    // Relative to the root
    outDir: './dist',
    rollupOptions: {
      input: {
        app: './index.html', // default
      },
      output: {
        manualChunks(path: string) {
          if (path.includes('/node_modules/@pixi/core/lib')) {
            return '@pixi-core';
          }
        },
      },
    },
  },
  plugins: [
    // Visualizer Docs: https://github.com/btd/rollup-plugin-visualizer
    rollupVisualizer() as PluginOption,
    // Visualizer Docs: https://vite-plugin-checker.netlify.app/checkers/overview.html
    typeChecker({
      typescript: true
    }),
  ],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: fileURLToPath(new URL('./src', import.meta.url)),
      },
    ],
  },
});
