import { useState } from 'react';

const STORAGE_KEY = 'dibase-show-font-size';
const MIN_SIZE = 16;
const MAX_SIZE = 40;
const DEFAULT_SIZE = 22;

function readStoredSize() {
  const stored = Number(localStorage.getItem(STORAGE_KEY));
  if (!Number.isFinite(stored)) return DEFAULT_SIZE;
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, stored));
}

export function useShowPreferences() {
  const [fontSize, setFontSizeState] = useState(readStoredSize);

  const setFontSize = (value: number) => {
    const next = Math.min(MAX_SIZE, Math.max(MIN_SIZE, value));
    setFontSizeState(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  };

  return {
    fontSize,
    setFontSize,
    smaller: () => setFontSize(fontSize - 2),
    larger: () => setFontSize(fontSize + 2),
  };
}
