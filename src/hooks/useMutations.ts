import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Setlist, Song } from '@/domain';
import { queryKeys } from './useCatalog';
import { useRepositories } from './useRepositories';

function replaceSong(songs: Song[] | undefined, updated: Song): Song[] | undefined {
  return songs?.map((song) => (song.id === updated.id ? updated : song));
}

export function useToggleFavorite() {
  const { songs } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => songs.toggleFavorite(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.songs, (current: Song[] | undefined) =>
        replaceSong(current, updated),
      );
      queryClient.setQueryData(queryKeys.song(updated.id), updated);
    },
  });
}

export function useUpdateKey() {
  const { songs } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, key }: { id: string; key: string }) =>
      songs.updateCurrentKey(id, key),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.songs, (current: Song[] | undefined) =>
        replaceSong(current, updated),
      );
      queryClient.setQueryData(queryKeys.song(updated.id), updated);
    },
  });
}

export function useRestoreKey() {
  const { songs } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => songs.restoreOriginalKey(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.songs, (current: Song[] | undefined) =>
        replaceSong(current, updated),
      );
      queryClient.setQueryData(queryKeys.song(updated.id), updated);
    },
  });
}

export function useUpdateSong() {
  const { songs } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<Omit<Song, 'id'>>;
    }) => songs.update(id, patch),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.songs, (current: Song[] | undefined) =>
        replaceSong(current, updated),
      );
      queryClient.setQueryData(queryKeys.song(updated.id), updated);
      void queryClient.invalidateQueries({ queryKey: queryKeys.relations });
    },
  });
}

export function useDeleteSong() {
  const { songs, blocks, setlists } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const relations = await blocks.getRelations();
      await Promise.all(
        relations
          .filter((item) => item.songId === id)
          .map((item) => blocks.removeSong(item.blockId, id)),
      );

      const allSetlists = await setlists.getAll();
      await Promise.all(
        allSetlists
          .filter((item) => item.songIds.includes(id))
          .map((item) => setlists.removeSong(item.id, id)),
      );

      await songs.delete(id);
      return id;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(queryKeys.songs, (current: Song[] | undefined) =>
        current?.filter((song) => song.id !== id),
      );
      queryClient.removeQueries({ queryKey: queryKeys.song(id) });
      void queryClient.invalidateQueries({ queryKey: queryKeys.relations });
      void queryClient.invalidateQueries({ queryKey: queryKeys.blocks });
      void queryClient.invalidateQueries({ queryKey: queryKeys.setlists });
    },
  });
}

export function useCreateSong() {
  const { songs, blocks } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { title: string; originalKey: string; blockId?: string }) => {
      const created = await songs.create({
        title: input.title.trim(),
        originalKey: input.originalKey,
        artist: null,
        lyrics: null,
        chords: null,
        notes: null,
      });

      if (input.blockId) {
        await blocks.addSong(input.blockId, created.id);
      }

      return { song: created, blockId: input.blockId };
    },
    onSuccess: ({ song, blockId }) => {
      queryClient.setQueryData(queryKeys.songs, (current: Song[] | undefined) => {
        const next = current ? [...current, song] : [song];
        return next.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
      });
      queryClient.setQueryData(queryKeys.song(song.id), song);
      void queryClient.invalidateQueries({ queryKey: queryKeys.relations });
      if (blockId) {
        void queryClient.invalidateQueries({ queryKey: queryKeys.blockSongs(blockId) });
      }
    },
  });
}

export function useCreateSetlist() {
  const { setlists } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; description?: string }) => setlists.create(input),
    onSuccess: (created) => {
      queryClient.setQueryData(queryKeys.setlists, (current: Setlist[] | undefined) =>
        current ? [created, ...current] : [created],
      );
      queryClient.setQueryData(queryKeys.setlist(created.id), created);
    },
  });
}

export function useUpdateSetlist() {
  const { setlists } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Partial<Pick<Setlist, 'name' | 'description' | 'songIds'>>;
    }) => setlists.update(id, patch),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.setlists, (current: Setlist[] | undefined) =>
        current?.map((item) => (item.id === updated.id ? updated : item)),
      );
      queryClient.setQueryData(queryKeys.setlist(updated.id), updated);
    },
  });
}

export function useDeleteSetlist() {
  const { setlists } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => setlists.delete(id),
    onSuccess: (_void, id) => {
      queryClient.setQueryData(queryKeys.setlists, (current: Setlist[] | undefined) =>
        current?.filter((item) => item.id !== id),
      );
      queryClient.removeQueries({ queryKey: queryKeys.setlist(id) });
    },
  });
}

export function useAddSetlistSong() {
  const { setlists } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setlistId, songId }: { setlistId: string; songId: string }) =>
      setlists.addSong(setlistId, songId),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.setlists, (current: Setlist[] | undefined) =>
        current?.map((item) => (item.id === updated.id ? updated : item)),
      );
      queryClient.setQueryData(queryKeys.setlist(updated.id), updated);
    },
  });
}

export function useRemoveSetlistSong() {
  const { setlists } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setlistId, songId }: { setlistId: string; songId: string }) =>
      setlists.removeSong(setlistId, songId),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.setlists, (current: Setlist[] | undefined) =>
        current?.map((item) => (item.id === updated.id ? updated : item)),
      );
      queryClient.setQueryData(queryKeys.setlist(updated.id), updated);
    },
  });
}

export function useReorderSetlistSongs() {
  const { setlists } = useRepositories();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ setlistId, songIds }: { setlistId: string; songIds: string[] }) =>
      setlists.reorderSongs(setlistId, songIds),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.setlists, (current: Setlist[] | undefined) =>
        current?.map((item) => (item.id === updated.id ? updated : item)),
      );
      queryClient.setQueryData(queryKeys.setlist(updated.id), updated);
    },
  });
}
