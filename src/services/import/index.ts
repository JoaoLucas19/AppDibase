import type { RepertoireSeed } from '@/data/seed';
import type { Block, BlockSong, Song } from '@/domain';

export type { Song, Block, BlockSong, Setlist, PlayContext } from '@/domain';

export interface ImportedRow {
  bloco: string | number;
  musica: string;
  tom: string;
  ordem?: number;
}

export function rowsToSeed(rows: ImportedRow[]): RepertoireSeed {
  const grouped = new Map<number, { title: string; originalKey: string }[]>();

  rows.forEach((row, index) => {
    const blockNumber = Number(row.bloco);
    const order = row.ordem ?? index;
    const list = grouped.get(blockNumber) ?? [];
    list[order] = { title: row.musica, originalKey: row.tom };
    grouped.set(blockNumber, list);
  });

  const songs: Song[] = [];
  const blocks: Block[] = [];
  const blockSongs: BlockSong[] = [];
  const songIdByTitle = new Map<string, string>();
  let songSeq = 1;

  const blockNumbers = [...grouped.keys()].sort((a, b) => a - b);
  for (const number of blockNumbers) {
    const blockId = `block-${String(number).padStart(2, '0')}`;
    blocks.push({
      id: blockId,
      name: `BLOCO ${String(number)}`,
      order: number,
    });

    const entries = (grouped.get(number) ?? []).filter(Boolean);
    entries.forEach((entry, songIndex) => {
      let songId = songIdByTitle.get(entry.title);
      if (!songId) {
        songId = `song-${String(songSeq).padStart(3, '0')}`;
        songSeq += 1;
        songIdByTitle.set(entry.title, songId);
        songs.push({
          id: songId,
          title: entry.title,
          artist: null,
          originalKey: entry.originalKey,
          currentKey: entry.originalKey,
          lyrics: null,
          chords: null,
          notes: null,
          favorite: false,
        });
      }

      blockSongs.push({
        blockId,
        songId,
        order: songIndex + 1,
      });
    });
  }

  return { songs, blocks, blockSongs };
}

export function parseCsvRepertoire(csv: string): ImportedRow[] {
  const lines = csv
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const [_header, ...rows] = lines;
  return rows.map((line) => {
    const [bloco = '', musica = '', tom = '', ordem] = line.split(',').map((part) => part.trim());
    return {
      bloco,
      musica,
      tom,
      ordem: ordem ? Number(ordem) : undefined,
    };
  });
}

export function parseJsonRepertoire(payload: unknown): ImportedRow[] {
  if (!Array.isArray(payload)) {
    throw new Error('JSON de repertório deve ser um array.');
  }

  return payload.map((item, index) => {
    if (typeof item !== 'object' || item === null) {
      throw new Error(`Linha ${String(index)} inválida.`);
    }

    const row = item as Record<string, unknown>;
    return {
      bloco: String(row.bloco ?? row.block ?? ''),
      musica: String(row.musica ?? row.title ?? row.song ?? ''),
      tom: String(row.tom ?? row.key ?? row.originalKey ?? ''),
      ordem: typeof row.ordem === 'number' ? row.ordem : undefined,
    };
  });
}
