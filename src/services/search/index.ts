import type { Block, BlockSong, Song } from '@/domain';

export function normalizeText(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

export function matchesQuery(haystack: string, query: string): boolean {
  if (!query) return true;
  return normalizeText(haystack).includes(normalizeText(query));
}

export function searchSongs(
  songs: Song[],
  blocks: Block[],
  relations: BlockSong[],
  query: string,
): Song[] {
  const normalized = normalizeText(query);
  if (!normalized) return songs;

  const blocksById = new Map(blocks.map((block) => [block.id, block]));
  const blocksBySong = new Map<string, Block[]>();

  for (const relation of relations) {
    const block = blocksById.get(relation.blockId);
    if (!block) continue;
    const list = blocksBySong.get(relation.songId) ?? [];
    list.push(block);
    blocksBySong.set(relation.songId, list);
  }

  return songs.filter((song) => {
    if (matchesQuery(song.title, normalized)) return true;
    if (song.artist && matchesQuery(song.artist, normalized)) return true;
    if (matchesQuery(song.originalKey, normalized)) return true;
    if (matchesQuery(song.currentKey, normalized)) return true;

    const songBlocks = blocksBySong.get(song.id) ?? [];
    return songBlocks.some(
      (block) =>
        matchesQuery(block.name, normalized) ||
        matchesQuery(String(block.order), normalized) ||
        matchesQuery(`bloco ${String(block.order)}`, normalized),
    );
  });
}
