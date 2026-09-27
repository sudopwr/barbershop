import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';

// Separate from vite.config.ts so the type/lint checker plugin doesn't run during tests.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: /^src(.+)/, replacement: path.resolve(process.cwd(), 'src/$1') }],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    css: false,
    coverage: { provider: 'v8', include: ['src/**/*.{ts,tsx}'], exclude: ['src/test/**', 'src/theme/**'] },
  },
});
