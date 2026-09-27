import path from 'path';
import checker from 'vite-plugin-checker';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

// ----------------------------------------------------------------------

const PORT = 3039;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.API_PROXY_TARGET || 'http://localhost:4000';

  return {
    plugins: [
      react(),
      checker({
        typescript: true,
        eslint: {
          useFlatConfig: true,
          lintCommand: 'eslint "./src/**/*.{js,jsx,ts,tsx}"',
          dev: { logLevel: ['error'] },
        },
        overlay: {
          position: 'tl',
          initialIsOpen: false,
        },
      }),
    ],
    resolve: {
      alias: [
        {
          find: /^src(.+)/,
          replacement: path.resolve(process.cwd(), 'src/$1'),
        },
      ],
    },
    server: {
      port: PORT,
      host: true,
      // Same-origin /api keeps the httpOnly session cookie simple (no CORS credentials dance)
      proxy: { '/api': { target: apiTarget, changeOrigin: true } },
      // Bind mounts in Docker Desktop don't always emit fs events
      watch: { usePolling: env.VITE_USE_POLLING === 'true' },
    },
    preview: { port: PORT, host: true, proxy: { '/api': { target: apiTarget, changeOrigin: true } } },
  };
});
