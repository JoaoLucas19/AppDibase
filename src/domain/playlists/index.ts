import type { BlockSong, PlayContext, Setlist, Song } from '@/domain';

export function buildPlaylist(
  context: PlayContext,
  songs: Song[],
  relations: BlockSong[],
  setlist?: Setlist | null,
): Song[] {
  const byId = new Map(songs.map((song) => [song.id, song]));

  if (context.type === 'block' && context.id) {
    return relations
      .filter((item) => item.blockId === context.id)
      .sort((a, b) => a.order - b.order)
      .flatMap((item) => {
        const song = byId.get(item.songId);
        return song ? [song] : [];
      });
  }

  if (context.type === 'setlist' && setlist) {
    return setlist.songIds.flatMap((id) => {
      const song = byId.get(id);
      return song ? [song] : [];
    });
  }

  if (context.type === 'favorites') {
    return songs
      .filter((song) => song.favorite)
      .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  }

  return [...songs].sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
}

export function getNeighbors(playlist: Song[], songId: string) {
  const index = playlist.findIndex((song) => song.id === songId);
  return {
    index,
    total: playlist.length,
    prev: index > 0 ? playlist[index - 1] : undefined,
    next: index >= 0 && index < playlist.length - 1 ? playlist[index + 1] : undefined,
    current: index >= 0 ? playlist[index] : undefined,
  };
}
