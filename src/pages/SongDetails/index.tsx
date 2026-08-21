import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ImprovPhrases } from '@/components/ImprovPhrases';
import { KeySelector } from '@/components/KeySelector';
import { PageHeader } from '@/components/PageHeader';
import { SongContent } from '@/components/SongContent';
import { SongEditor } from '@/components/SongEditor';
import { SongNavigation } from '@/components/SongNavigation';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { getNeighbors, buildPlaylist } from '@/domain/playlists';
import { useRelations, useSetlist, useSongs } from '@/hooks/useCatalog';
import {
  useDeleteSong,
  useRestoreKey,
  useToggleFavorite,
  useUpdateKey,
  useUpdateSong,
} from '@/hooks/useMutations';
import { transposeDown, transposeUp } from '@/services/transpose';
import { showHref, songHref } from '@/utils/routes';
import type { PlayContextType } from '@/domain';

function usePlayContextFromRoute(): {
  type: PlayContextType;
  id?: string;
  backTo: string;
  backLabel: string;
} {
  const params = useParams();
  const location = useLocation();

  if (params.blockId) {
    return {
      type: 'block',
      id: params.blockId,
      backTo: `/blocks/${params.blockId}`,
      backLabel: 'Bloco',
    };
  }

  if (params.setlistId) {
    return {
      type: 'setlist',
      id: params.setlistId,
      backTo: `/setlists/${params.setlistId}`,
      backLabel: 'Setlist',
    };
  }

  if (location.pathname.startsWith('/favorites')) {
    return { type: 'favorites', backTo: '/favorites', backLabel: 'Favoritos' };
  }

  return { type: 'all', backTo: '/songs', backLabel: 'Músicas' };
}

export function SongDetailsPage() {
  const { songId } = useParams();
  const navigate = useNavigate();
  const context = usePlayContextFromRoute();
  const songsQuery = useSongs();
  const relationsQuery = useRelations();
  const setlistQuery = useSetlist(context.type === 'setlist' ? context.id : undefined);
  const toggleFavorite = useToggleFavorite();
  const updateKey = useUpdateKey();
  const restoreKey = useRestoreKey();
  const updateSong = useUpdateSong();
  const deleteSong = useDeleteSong();
  const [editing, setEditing] = useState(false);

  const song = useMemo(
    () => songsQuery.data?.find((item) => item.id === songId),
    [songId, songsQuery.data],
  );

  const playlist = useMemo(
    () =>
      buildPlaylist(
        { type: context.type, id: context.id },
        songsQuery.data ?? [],
        relationsQuery.data ?? [],
        setlistQuery.data,
      ),
    [context.id, context.type, relationsQuery.data, setlistQuery.data, songsQuery.data],
  );

  const neighbors = songId ? getNeighbors(playlist, songId) : { prev: undefined, next: undefined };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!song || editing) return;
      if (event.key === 'ArrowLeft') {
        const prevId = neighbors.prev?.id;
        if (prevId) void navigate(songHref(prevId, { type: context.type, id: context.id }));
      }
      if (event.key === 'ArrowRight') {
        const nextId = neighbors.next?.id;
        if (nextId) void navigate(songHref(nextId, { type: context.type, id: context.id }));
      }
      if (event.key === '+' || event.key === '=') {
        updateKey.mutate({ id: song.id, key: transposeUp(song.currentKey) });
      }
      if (event.key === '-' || event.key === '_') {
        updateKey.mutate({ id: song.id, key: transposeDown(song.currentKey) });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    context.id,
    context.type,
    editing,
    navigate,
    neighbors.next?.id,
    neighbors.prev?.id,
    song,
    updateKey,
  ]);

  if (songsQuery.isLoading || relationsQuery.isLoading) {
    return <LoadingState />;
  }

  if (songsQuery.isError) {
    return <ErrorState message="Não foi possível abrir a música." />;
  }

  if (!song) {
    return <EmptyState title="Música não encontrada" description="Ela pode ter sido removida." />;
  }

  const go = (id?: string) => {
    if (!id) return;
    void navigate(songHref(id, { type: context.type, id: context.id }));
  };

  const remove = async () => {
    const confirmed = window.confirm(`Excluir "${song.title}" do repertório?`);
    if (!confirmed) return;
    await deleteSong.mutateAsync(song.id);
    void navigate(context.backTo);
  };

  return (
    <div>
      <PageHeader
        title={song.title}
        backTo={context.backTo}
        backLabel={context.backLabel}
        actions={
          <FavoriteButton song={song} onToggle={() => toggleFavorite.mutate(song.id)} />
        }
      />
      <div className="space-y-6 px-4 py-4">
        {song.artist ? <p className="text-mute">{song.artist}</p> : null}

        {editing ? (
          <SongEditor
            song={song}
            pending={updateSong.isPending}
            onCancel={() => setEditing(false)}
            onSave={(patch) => {
              updateSong.mutate(
                { id: song.id, patch },
                { onSuccess: () => setEditing(false) },
              );
            }}
          />
        ) : (
          <>
            <KeySelector
              originalKey={song.originalKey}
              currentKey={song.currentKey}
              onUp={() =>
                updateKey.mutate({ id: song.id, key: transposeUp(song.currentKey) })
              }
              onDown={() =>
                updateKey.mutate({ id: song.id, key: transposeDown(song.currentKey) })
              }
              onRestore={() => restoreKey.mutate(song.id)}
            />

            <ImprovPhrases
              musicalKey={song.currentKey}
              songTitle={song.title}
              customCue={song.improvCue}
            />

            <Link
              to={showHref(song.id, { type: context.type, id: context.id })}
              className="flex min-h-14 items-center justify-center rounded-2xl bg-gold text-base font-bold text-stage"
            >
              🎤 Modo Show
            </Link>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="min-h-12 rounded-xl bg-stage-elevated font-semibold"
              >
                Editar cifra
              </button>
              <button
                type="button"
                onClick={() => void remove()}
                disabled={deleteSong.isPending}
                className="min-h-12 rounded-xl bg-stage-elevated font-semibold text-danger"
              >
                Excluir
              </button>
            </div>

            <div className="h-px bg-stage-border" />
            <SongContent song={song} />
            <div className="h-px bg-stage-border" />

            <SongNavigation
              onPrev={() => go(neighbors.prev?.id)}
              onNext={() => go(neighbors.next?.id)}
              hasPrev={Boolean(neighbors.prev)}
              hasNext={Boolean(neighbors.next)}
            />
          </>
        )}
      </div>
    </div>
  );
}
