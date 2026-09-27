import { resolveApiUrl } from '@/lib/api-url';

describe('resolveApiUrl', () => {
  it('prefers an explicit URL and trims trailing slashes', () => {
    expect(resolveApiUrl({ explicitUrl: 'https://shop.example.com/api/', platform: 'ios' })).toBe(
      'https://shop.example.com/api'
    );
  });

  it('reuses the dev-server host so a phone on the same Wi-Fi reaches the API', () => {
    expect(resolveApiUrl({ hostUri: '192.168.1.20:8081', platform: 'android' })).toBe('http://192.168.1.20:4000/api');
    expect(resolveApiUrl({ hostUri: '192.168.1.20:8081', platform: 'ios', port: 5000 })).toBe(
      'http://192.168.1.20:5000/api'
    );
  });

  it('falls back to the emulator/simulator loopback', () => {
    expect(resolveApiUrl({ hostUri: 'localhost:8081', platform: 'android' })).toBe('http://10.0.2.2:4000/api');
    expect(resolveApiUrl({ platform: 'ios' })).toBe('http://localhost:4000/api');
  });
});
