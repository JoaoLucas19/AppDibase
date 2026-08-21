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
const CHORD_TOKEN =
  /^[A-G](?:#|b)?(?:maj7|maj|min7|min|m7|m9|m6|m|M7|dim7|dim|aug|sus4|sus2|sus|add9|add2|°|ø)?(?:7|9|11|13|6|4|2)?(?:\/[A-G](?:#|b)?)?$/;

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

function transposeRoot(root: string, semitones: number): string {
  const normalized = ENHARMONIC[root] ?? root;
  const index = SHARP_SCALE.indexOf(normalized as (typeof SHARP_SCALE)[number]);
  if (index < 0) return root;
  return SHARP_SCALE[(index + semitones + 1200) % 12] ?? root;
}

export function semitoneDistance(fromKey: string, toKey: string): number {
  try {
    const from = parseKey(fromKey);
    const to = parseKey(toKey);
    const fromIndex = SHARP_SCALE.indexOf(from.root as (typeof SHARP_SCALE)[number]);
    const toIndex = SHARP_SCALE.indexOf(to.root as (typeof SHARP_SCALE)[number]);
    if (fromIndex < 0 || toIndex < 0) return 0;
    return (toIndex - fromIndex + 12) % 12;
  } catch {
    return 0;
  }
}

export function transposeChordSymbol(symbol: string, semitones: number): string {
  if (semitones % 12 === 0) return symbol;
  const match = /^([A-G](?:#|b)?)(.*?)(?:\/([A-G](?:#|b)?))?$/.exec(symbol.trim());
  if (!match) return symbol;
  const root = match[1] ?? '';
  const quality = match[2] ?? '';
  const bass = match[3];
  const nextBass = bass ? `/${transposeRoot(bass, semitones)}` : '';
  return `${transposeRoot(root, semitones)}${quality}${nextBass}`;
}

export function transposeChart(chart: string, fromKey: string, toKey: string): string {
  const semitones = semitoneDistance(fromKey, toKey);
  if (!chart || semitones === 0) return chart;

  return chart
    .split('\n')
    .map((line) =>
      line.replace(/\S+/g, (token) => {
        const clean = token.replace(/[.,;:!?()[\]]+$/g, '').replace(/^[([{]+/g, '');
        if (!CHORD_TOKEN.test(clean)) return token;
        return token.replace(clean, transposeChordSymbol(clean, semitones));
      }),
    )
    .join('\n');
}

export function isChordToken(token: string): boolean {
  return CHORD_TOKEN.test(token.trim());
}
