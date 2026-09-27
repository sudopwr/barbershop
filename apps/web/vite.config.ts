import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiTarget = env.API_PROXY_TARGET || 'http://localhost:4000';

  return {
    plugins: [react()],
    resolve: { alias: { src: path.resolve(process.cwd(), 'src') } },
    server: {
      port: 5173,
      host: true,
      proxy: { '/api': { target: apiTarget, changeOrigin: true } },
      // Bind mounts in Docker Desktop don't always emit fs events
      watch: { usePolling: env.VITE_USE_POLLING === 'true' },
    },
    preview: { port: 5173, host: true, proxy: { '/api': { target: apiTarget, changeOrigin: true } } },
  };
});
