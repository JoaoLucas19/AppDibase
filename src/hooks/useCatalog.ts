import { useQuery } from '@tanstack/react-query';
import { useRepositories } from './useRepositories';

export const queryKeys = {
  songs: ['songs'] as const,
  song: (id: string) => ['songs', id] as const,
  blocks: ['blocks'] as const,
  block: (id: string) => ['blocks', id] as const,
  relations: ['blockSongs'] as const,
  blockSongs: (id: string) => ['blocks', id, 'songs'] as const,
  setlists: ['setlists'] as const,
  setlist: (id: string) => ['setlists', id] as const,
};

export function useSongs() {
  const { songs } = useRepositories();
  return useQuery({
    queryKey: queryKeys.songs,
    queryFn: () => songs.getAll(),
  });
}

export function useSong(id: string | undefined) {
  const { songs } = useRepositories();
  return useQuery({
    queryKey: queryKeys.song(id ?? ''),
    queryFn: () => (id ? songs.getById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
}

export function useBlocks() {
  const { blocks } = useRepositories();
  return useQuery({
    queryKey: queryKeys.blocks,
    queryFn: () => blocks.getAll(),
  });
}

export function useBlock(id: string | undefined) {
  const { blocks } = useRepositories();
  return useQuery({
    queryKey: queryKeys.block(id ?? ''),
    queryFn: () => (id ? blocks.getById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
}

export function useRelations() {
  const { blocks } = useRepositories();
  return useQuery({
    queryKey: queryKeys.relations,
    queryFn: () => blocks.getRelations(),
  });
}

export function useBlockSongs(blockId: string | undefined) {
  const { blocks } = useRepositories();
  return useQuery({
    queryKey: queryKeys.blockSongs(blockId ?? ''),
    queryFn: () => (blockId ? blocks.getSongs(blockId) : Promise.resolve([])),
    enabled: Boolean(blockId),
  });
}

export function useSetlists() {
  const { setlists } = useRepositories();
  return useQuery({
    queryKey: queryKeys.setlists,
    queryFn: () => setlists.getAll(),
  });
}

export function useSetlist(id: string | undefined) {
  const { setlists } = useRepositories();
  return useQuery({
    queryKey: queryKeys.setlist(id ?? ''),
    queryFn: () => (id ? setlists.getById(id) : Promise.resolve(null)),
    enabled: Boolean(id),
  });
}
