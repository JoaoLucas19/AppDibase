import {
  describeKey,
  getDominantSeventh,
  getHarmonicField,
  getPentatonicSpellings,
  toSolfege,
} from '@/services/harmony';

export interface ImprovPhrase {
  id: string;
  title: string;
  when: string;
  notes: string;
  backing: string;
  tip: string;
}

export interface ImprovGuide {
  keyLabel: string;
  minor: boolean;
  scaleLabel: string;
  scaleNotes: string;
  cadence: string;
  cadenceDegrees: string;
  phrases: ImprovPhrase[];
}

function joinNotes(notes: string[]): string {
  return notes.map((note) => toSolfege(note)).join(' · ');
}

function pick(scale: string[], indexes: number[]): string[] {
  return indexes.map((index) => {
    const wrapped = ((index % scale.length) + scale.length) % scale.length;
    return scale[wrapped] ?? scale[0] ?? 'C';
  });
}

const CUE_BY_TITLE: Record<string, string> = {
  'trem das onzes':
    'Pausa clássica da banda: cada um faz uma gracinha curta e o último fecha no V7, voltando ao I.',
  'trem das onze':
    'Pausa clássica da banda: cada um faz uma gracinha curta e o último fecha no V7, voltando ao I.',
};

export function getSongImprovCue(title: string, customCue?: string | null): string | null {
  const trimmed = customCue?.trim();
  if (trimmed) return trimmed;
  return CUE_BY_TITLE[title.trim().toLowerCase()] ?? null;
}

export function getImprovGuide(key: string): ImprovGuide | null {
  try {
    const field = getHarmonicField(key);
    const pentatonic = getPentatonicSpellings(key);
    const tonic = field.chords[0]?.symbol ?? key;
    const subdominant = field.chords[3]?.symbol ?? tonic;
    const dominant = getDominantSeventh(key);
    const cadence = `${tonic}  →  ${subdominant}  →  ${dominant}  →  ${tonic}`;
    const cadenceDegrees = field.minor ? 'i – iv – V7 – i' : 'I – IV – V7 – I';

    const phrases: ImprovPhrase[] = [
      {
        id: 'pause',
        title: 'Gracinha na pausa',
        when: 'Quando a banda para e cada um faz a sua.',
        notes: joinNotes(pick(pentatonic, [0, 1, 2, 3, 2, 1, 0])),
        backing: tonic,
        tip: 'Sobe e desce na pentatônica e fecha no I. Cabe em um fôlego.',
      },
      {
        id: 'call',
        title: 'Chamada curta',
        when: 'Primeira gracinha, bem curta, para os outros responderem.',
        notes: joinNotes(pick(pentatonic, [3, 2, 1, 0])),
        backing: tonic,
        tip: 'Quatro notas. Deixa espaço para o próximo músico.',
      },
      {
        id: 'iv',
        title: 'Pergunta no IV',
        when: 'Se a harmonia “abre” um pouco no meio da pausa.',
        notes: joinNotes(pick(pentatonic, [0, 1, 2, 1, 0])),
        backing: `${tonic}  →  ${subdominant}  →  ${tonic}`,
        tip: 'Encosta no IV e volta logo. Não alongue.',
      },
      {
        id: 'turnaround',
        title: 'Fecha no V7',
        when: 'Última gracinha, para a banda voltar a tocar juntos.',
        notes: joinNotes(pick(pentatonic, [2, 3, 4, 0])),
        backing: `${dominant}  →  ${tonic}`,
        tip: 'A tensão do V7 puxa o restante da banda de volta ao I.',
      },
    ];

    return {
      keyLabel: describeKey(key),
      minor: field.minor,
      scaleLabel: field.minor ? 'Pentatônica menor' : 'Pentatônica maior',
      scaleNotes: pentatonic.map((note) => toSolfege(note)).join('   '),
      cadence,
      cadenceDegrees,
      phrases,
    };
  } catch {
    return null;
  }
}
