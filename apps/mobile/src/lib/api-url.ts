/**
 * Decides which API the app talks to.
 *
 * 1. EXPO_PUBLIC_API_URL wins (set it for staging/production builds).
 * 2. In development, reuse the host that serves the JS bundle: when you run
 *    `expo start`, a phone on the same Wi-Fi loads the app from e.g.
 *    192.168.1.20:8081, so the API is at http://192.168.1.20:4000/api.
 * 3. Otherwise localhost (iOS simulator), or 10.0.2.2 on the Android emulator.
 */
export function resolveApiUrl(options: {
  explicitUrl?: string;
  hostUri?: string | null;
  platform: string;
  port?: string | number;
}): string {
  const { explicitUrl, hostUri, platform, port = 4000 } = options;

  if (explicitUrl?.trim()) return explicitUrl.trim().replace(/\/+$/, '');

  const host = hostUri?.split(':')[0];
  if (host && host !== 'localhost' && host !== '127.0.0.1') return `http://${host}:${port}/api`;

  return platform === 'android' ? `http://10.0.2.2:${port}/api` : `http://localhost:${port}/api`;
}
