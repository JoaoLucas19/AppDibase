const SHARP_SCALE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

const ENHARMONIC: Record<string, string> = {
  Db: 'C#',
  Eb: 'D#',
  Fb: 'E',
  Gb: 'F#',
  Ab: 'G#',
  Bb: 'A#',
  Cb: 'B',
  'E#': 'F',
  'B#': 'C',
};

export interface ParsedKey {
  root: string;
  minor: boolean;
}

const KEY_PATTERN = /^([A-G])([#b])?(m)?$/;

export function parseKey(key: string): ParsedKey {
  const match = KEY_PATTERN.exec(key.trim());
  if (!match) {
    throw new Error(`Tom inválido: ${key}`);
  }

  const letter = match[1] ?? 'C';
  const accidental = match[2] ?? '';
  const minor = match[3] === 'm';
  const rawRoot = `${letter}${accidental}`;
  const root = ENHARMONIC[rawRoot] ?? rawRoot;

  return { root, minor };
}

export function transposeKey(key: string, semitones: number): string {
  const parsed = parseKey(key);
  const currentIndex = SHARP_SCALE.indexOf(parsed.root as (typeof SHARP_SCALE)[number]);
  if (currentIndex < 0) {
    throw new Error(`Tom inválido: ${key}`);
  }

  const nextIndex = (currentIndex + semitones + 1200) % 12;
  const nextRoot = SHARP_SCALE[nextIndex] ?? 'C';
  return `${nextRoot}${parsed.minor ? 'm' : ''}`;
}

export function transposeUp(key: string): string {
  return transposeKey(key, 1);
}

export function transposeDown(key: string): string {
  return transposeKey(key, -1);
}

export function keysEqual(left: string, right: string): boolean {
  try {
    const a = parseKey(left);
    const b = parseKey(right);
    return a.root === b.root && a.minor === b.minor;
  } catch {
    return left === right;
  }
}
