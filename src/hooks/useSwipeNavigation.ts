import { useRef, type TouchEventHandler } from 'react';

interface SwipeHandlers {
  onTouchStart: TouchEventHandler<HTMLElement>;
  onTouchEnd: TouchEventHandler<HTMLElement>;
}

export function useSwipeNavigation(onPrev: () => void, onNext: () => void): SwipeHandlers {
  const startX = useRef(0);
  const startY = useRef(0);

  return {
    onTouchStart: (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;
      startX.current = touch.clientX;
      startY.current = touch.clientY;
    },
    onTouchEnd: (event) => {
      const touch = event.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;

      if (Math.abs(dx) < 80) return;
      if (Math.abs(dy) > 70) return;
      if (Math.abs(dx) < Math.abs(dy) * 1.6) return;

      if (dx < 0) onNext();
      else onPrev();
    },
  };
}
