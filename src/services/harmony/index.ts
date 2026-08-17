const LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
const NATURAL_SEMITONE: Record<(typeof LETTERS)[number], number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11] as const;
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10] as const;

const MAJOR_QUALITIES = ['', 'm', 'm', '', '', 'm', 'dim'] as const;
const MINOR_QUALITIES = ['m', 'dim', '', 'm', 'm', '', ''] as const;

const MAJOR_DEGREES = ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'] as const;
const MINOR_DEGREES = ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'] as const;

const SOLFEGE: Record<string, string> = {
  C: 'Dó',
  'C#': 'Dó#',
  Db: 'Réb',
  D: 'Ré',
  'D#': 'Ré#',
  Eb: 'Mib',
  E: 'Mi',
  Fb: 'Mib',
  F: 'Fá',
  'E#': 'Mi#',
  'F#': 'Fá#',
  Gb: 'Solb',
  G: 'Sol',
  'G#': 'Sol#',
  Ab: 'Láb',
  A: 'Lá',
  'A#': 'Lá#',
  Bb: 'Sib',
  B: 'Si',
  Cb: 'Dób',
  'B#': 'Si#',
};

export type ChordQuality = '' | 'm' | 'dim';

export interface HarmonicChord {
  degree: string;
  symbol: string;
  primary: boolean;
}

export interface HarmonicField {
  key: string;
  minor: boolean;
  label: string;
  chords: HarmonicChord[];
}

const KEY_PATTERN = /^([A-G])(#{1,2}|b{1,2})?(m)?$/;

function parseDisplayKey(key: string): {
  letter: (typeof LETTERS)[number];
  accidental: number;
  minor: boolean;
} {
  const match = KEY_PATTERN.exec(key.trim());
  if (!match) {
    throw new Error(`Tom inválido: ${key}`);
  }

  const letter = match[1] as (typeof LETTERS)[number];
  const marks = match[2] ?? '';
  const accidental = marks.startsWith('b') ? -marks.length : marks.length;

  return { letter, accidental, minor: match[3] === 'm' };
}

function formatNote(letter: (typeof LETTERS)[number], accidental: number): string {
  const mark =
    accidental <= -2 ? 'bb' : accidental === -1 ? 'b' : accidental === 1 ? '#' : accidental >= 2 ? '##' : '';
  return `${letter}${mark}`;
}

function spellScaleNote(
  rootLetter: (typeof LETTERS)[number],
  rootAccidental: number,
  interval: number,
  letterOffset: number,
): string {
  const letterIndex = LETTERS.indexOf(rootLetter);
  const targetLetter = LETTERS[(letterIndex + letterOffset) % 7];
  if (!targetLetter) {
    return 'C';
  }

  const desired = (NATURAL_SEMITONE[rootLetter] + rootAccidental + interval + 120) % 12;
  const natural = NATURAL_SEMITONE[targetLetter];
  let accidental = desired - natural;
  if (accidental > 6) accidental -= 12;
  if (accidental < -6) accidental += 12;

  return formatNote(targetLetter, accidental);
}

export function describeKey(key: string): string {
  try {
    const parsed = parseDisplayKey(key);
    const note = formatNote(parsed.letter, parsed.accidental);
    const solfege = SOLFEGE[note] ?? note;
    return `${solfege} ${parsed.minor ? 'menor' : 'maior'}`;
  } catch {
    return key;
  }
}

export function getHarmonicField(key: string): HarmonicField {
  const parsed = parseDisplayKey(key);
  const intervals = parsed.minor ? MINOR_INTERVALS : MAJOR_INTERVALS;
  const qualities = parsed.minor ? MINOR_QUALITIES : MAJOR_QUALITIES;
  const degrees = parsed.minor ? MINOR_DEGREES : MAJOR_DEGREES;

  const chords = intervals.map((interval, index) => {
    const note = spellScaleNote(parsed.letter, parsed.accidental, interval, index);
    const quality = qualities[index] ?? '';
    const degree = degrees[index] ?? String(index + 1);
    return {
      degree,
      symbol: `${note}${quality}`,
      primary: index === 0 || index === 3 || index === 4,
    };
  });

  return {
    key,
    minor: parsed.minor,
    label: describeKey(key),
    chords,
  };
}

export function getPrimaryChords(key: string): string[] {
  return getHarmonicField(key)
    .chords.filter((chord) => chord.primary)
    .map((chord) => chord.symbol);
}

const MAJOR_KEY_CHOICES = [
  'C',
  'C#',
  'Db',
  'D',
  'D#',
  'Eb',
  'E',
  'F',
  'F#',
  'Gb',
  'G',
  'G#',
  'Ab',
  'A',
  'A#',
  'Bb',
  'B',
] as const;

export const KEY_CHOICES = [
  ...MAJOR_KEY_CHOICES,
  ...MAJOR_KEY_CHOICES.map((key) => `${key}m`),
] as const;

