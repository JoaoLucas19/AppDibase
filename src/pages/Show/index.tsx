import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AutoScroll } from '@/components/AutoScroll';
import { KeySelector } from '@/components/KeySelector';
import { SongContent } from '@/components/SongContent';
import { SongNavigation } from '@/components/SongNavigation';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import type { PlayContextType } from '@/domain';
import { buildPlaylist, getNeighbors } from '@/domain/playlists';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { useRelations, useSetlist, useSongs } from '@/hooks/useCatalog';
import { useRestoreKey, useToggleFavorite, useUpdateKey } from '@/hooks/useMutations';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import { transposeDown, transposeUp } from '@/services/transpose';
import { showHref, songHref } from '@/utils/routes';

const CONTEXT_TYPES: PlayContextType[] = ['block', 'setlist', 'favorites', 'all'];

function isPlayContextType(value: string | undefined): value is PlayContextType {
  return Boolean(value && CONTEXT_TYPES.includes(value as PlayContextType));
}

export function ShowPage() {
  const { contextType, contextId, songId } = useParams();
  const navigate = useNavigate();
  const songsQuery = useSongs();
  const relationsQuery = useRelations();
  const type: PlayContextType = isPlayContextType(contextType) ? contextType : 'all';
  const contextIdValue = contextId && contextId !== '_' ? contextId : undefined;
  const setlistQuery = useSetlist(type === 'setlist' ? contextIdValue : undefined);
  const updateKey = useUpdateKey();
  const restoreKey = useRestoreKey();
  const toggleFavorite = useToggleFavorite();
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toggle, running, speed, setSpeed, start, pause } = useAutoScroll(scrollRef);

  const playlist = useMemo(
    () =>
      buildPlaylist(
        { type, id: contextIdValue },
        songsQuery.data ?? [],
        relationsQuery.data ?? [],
        setlistQuery.data,
      ),
    [contextIdValue, relationsQuery.data, setlistQuery.data, songsQuery.data, type],
  );

  const neighbors = songId ? getNeighbors(playlist, songId) : undefined;
  const song = neighbors?.current ?? songsQuery.data?.find((item) => item.id === songId);

  const go = useCallback(
    (id?: string) => {
      if (!id) return;
      void navigate(showHref(id, { type, id: contextIdValue }), { replace: true });
    },
    [contextIdValue, navigate, type],
  );

  const swipe = useSwipeNavigation(
    () => go(neighbors?.prev?.id),
    () => go(neighbors?.next?.id),
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [songId]);

  useEffect(() => {
    const node = document.documentElement;
    void node.requestFullscreen?.().catch(() => undefined);
    return () => {
      if (document.fullscreenElement) {
        void document.exitFullscreen().catch(() => undefined);
      }
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!song) return;
      if (event.key === 'ArrowLeft') go(neighbors?.prev?.id);
      if (event.key === 'ArrowRight') go(neighbors?.next?.id);
      if (event.key === '+' || event.key === '=') {
        updateKey.mutate({ id: song.id, key: transposeUp(song.currentKey) });
      }
      if (event.key === '-' || event.key === '_') {
        updateKey.mutate({ id: song.id, key: transposeDown(song.currentKey) });
      }
      if (event.key.toLowerCase() === 's') {
        toggle();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, neighbors?.next?.id, neighbors?.prev?.id, song, toggle, updateKey]);

  if (songsQuery.isLoading || relationsQuery.isLoading) return <LoadingState />;
  if (songsQuery.isError) return <ErrorState message="Não foi possível abrir o Modo Show." />;
  if (!song) {
    return (
      <EmptyState title="Música não encontrada" description="Volte e escolha outra faixa." />
    );
  }

  const position = neighbors && neighbors.index >= 0 ? neighbors.index + 1 : 1;
  const total = neighbors?.total || 1;
  const exitTo = songHref(song.id, { type, id: contextIdValue });

  return (
    <div className="flex min-h-dvh flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <header className="px-4 py-3">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold tabular-nums text-gold">
            {String(position).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite.mutate(song.id)}
              className="min-h-11 px-2 text-xl text-gold"
              aria-label={song.favorite ? 'Remover dos favoritos' : 'Favoritar'}
            >
              {song.favorite ? '★' : '☆'}
            </button>
            <Link to={exitTo} className="min-h-11 px-2 text-sm font-semibold text-mute">
              Sair
            </Link>
          </div>
        </div>
        <h1 className="mt-2 text-3xl font-bold uppercase leading-tight tracking-wide">
          {song.title}
        </h1>
        {song.artist ? <p className="mt-1 text-mute">{song.artist}</p> : null}
        <div className="mt-4">
          <KeySelector
            originalKey={song.originalKey}
            currentKey={song.currentKey}
            onUp={() => updateKey.mutate({ id: song.id, key: transposeUp(song.currentKey) })}
            onDown={() =>
              updateKey.mutate({ id: song.id, key: transposeDown(song.currentKey) })
            }
            onRestore={() => restoreKey.mutate(song.id)}
            large
          />
        </div>
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 py-4"
        {...swipe}
      >
        <SongContent song={song} large />
      </div>

      <div className="space-y-3 border-t border-stage-border bg-stage px-4 py-3">
        <AutoScroll
          running={running}
          speed={speed}
          onStart={start}
          onPause={pause}
          onSlower={() => setSpeed(speed - 6)}
          onFaster={() => setSpeed(speed + 6)}
        />
        <SongNavigation
          onPrev={() => go(neighbors?.prev?.id)}
          onNext={() => go(neighbors?.next?.id)}
          hasPrev={Boolean(neighbors?.prev)}
          hasNext={Boolean(neighbors?.next)}
        />
      </div>
    </div>
  );
}
