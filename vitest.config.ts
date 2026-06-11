/// <reference types="vitest" />
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => ({
  plugins: [
    angular(),
    tsConfigPaths(),
  ],
  test: {
    globals: true,
    setupFiles: ['src/setup-vitest.ts'],
    environment: 'jsdom',
    include: ['src/**/*.spec.ts'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
