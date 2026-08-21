import type { Block, BlockSong, Song } from '@/domain';
import type { SeedBlockEntry } from './raw';

export const SEED_VERSION = 1;
export const EXPECTED_BLOCK_COUNT = 34;
export const INTENTIONAL_DUPLICATE_TITLES = ['Tô na Vibe', 'Arrependidaço'] as const;

export interface RepertoireSeed {
  songs: Song[];
  blocks: Block[];
  blockSongs: BlockSong[];
}

function pad(value: number, size: number): string {
  return String(value).padStart(size, '0');
}

export function buildSeed(rawBlocks: SeedBlockEntry[]): RepertoireSeed {
  const songs: Song[] = [];
  const blocks: Block[] = [];
  const blockSongs: BlockSong[] = [];
  const songIdByTitle = new Map<string, string>();
  let songSeq = 1;

  for (const raw of rawBlocks) {
    const blockId = `block-${pad(raw.number, 2)}`;
    blocks.push({
      id: blockId,
      name: `BLOCO ${raw.number}`,
      order: raw.number,
    });

    raw.songs.forEach((entry, index) => {
      let songId = songIdByTitle.get(entry.title);
      if (!songId) {
        songId = `song-${pad(songSeq, 3)}`;
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
          improvCue: null,
          favorite: false,
        });
      }

      blockSongs.push({
        blockId,
        songId,
        order: index + 1,
      });
    });
  }

  return { songs, blocks, blockSongs };
}
