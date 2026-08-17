import { useCallback, useEffect, useState, type RefObject } from 'react';

const SPEED_KEY = 'repertorio.autoscroll.speed';

export function useAutoScroll(containerRef: RefObject<HTMLElement | null>) {
  const [running, setRunning] = useState(false);
  const [speed, setSpeedState] = useState(() => {
    const saved = localStorage.getItem(SPEED_KEY);
    const parsed = saved ? Number(saved) : 28;
    return Number.isFinite(parsed) ? parsed : 28;
  });

  useEffect(() => {
    localStorage.setItem(SPEED_KEY, String(speed));
  }, [speed]);

  useEffect(() => {
    if (!running) return;

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const el = containerRef.current;
      if (el) {
        const delta = (now - last) / 1000;
        el.scrollTop += speed * delta;
        last = now;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) {
          setRunning(false);
          return;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [containerRef, running, speed]);

  const setSpeed = useCallback((value: number) => {
    setSpeedState(Math.min(90, Math.max(8, value)));
  }, []);

  const start = useCallback(() => setRunning(true), []);
  const pause = useCallback(() => setRunning(false), []);
  const toggle = useCallback(() => setRunning((value) => !value), []);

  return { running, speed, setSpeed, start, pause, toggle };
}
