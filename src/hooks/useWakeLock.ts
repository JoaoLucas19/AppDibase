import { useEffect } from 'react';

type ScreenLock = { release: () => Promise<void> };

export function useWakeLock(active = true) {
  useEffect(() => {
    const api = (
      navigator as Navigator & {
        wakeLock?: { request: (type: 'screen') => Promise<ScreenLock> };
      }
    ).wakeLock;

    if (!active || !api) return;

    let released = false;
    let lock: ScreenLock | null = null;

    const request = async () => {
      if (released || document.visibilityState !== 'visible') return;
      try {
        lock = await api.request('screen');
      } catch {
        lock = null;
      }
    };

    void request();
    document.addEventListener('visibilitychange', request);

    return () => {
      released = true;
      document.removeEventListener('visibilitychange', request);
      void lock?.release().catch(() => undefined);
    };
  }, [active]);
}
