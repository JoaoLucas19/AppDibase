import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { useSetlist, useSongs } from '@/hooks/useCatalog';
import {
  useAddSetlistSong,
  useRemoveSetlistSong,
  useReorderSetlistSongs,
  useUpdateSetlist,
} from '@/hooks/useMutations';
import { normalizeText } from '@/services/search';

export function SetlistEditPage() {
  const { setlistId } = useParams();
  const navigate = useNavigate();
  const setlistQuery = useSetlist(setlistId);
  const songsQuery = useSongs();
  const updateSetlist = useUpdateSetlist();
  const addSong = useAddSetlistSong();
  const removeSong = useRemoveSetlistSong();
  const reorder = useReorderSetlistSongs();
  const [query, setQuery] = useState('');
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  const setlist = setlistQuery.data;
  const nameValue = name ?? setlist?.name ?? '';
  const descriptionValue = description ?? setlist?.description ?? '';
  const songsById = useMemo(
    () => new Map((songsQuery.data ?? []).map((song) => [song.id, song])),
    [songsQuery.data],
  );

  const ordered = useMemo(
    () =>
      (setlist?.songIds ?? []).flatMap((id) => {
        const song = songsById.get(id);
        return song ? [song] : [];
      }),
    [setlist?.songIds, songsById],
  );

  const available = useMemo(() => {
    const selected = new Set(setlist?.songIds ?? []);
    return (songsQuery.data ?? []).filter((song) => {
      if (selected.has(song.id)) return false;
      if (!query.trim()) return true;
      return normalizeText(song.title).includes(normalizeText(query));
    });
  }, [query, setlist?.songIds, songsQuery.data]);

  if (setlistQuery.isLoading || songsQuery.isLoading) return <LoadingState />;
  if (setlistQuery.isError || songsQuery.isError) {
    return <ErrorState message="Não foi possível editar a setlist." />;
  }
  if (!setlist) {
    return <EmptyState title="Setlist não encontrada" description="Ela pode ter sido excluída." />;
  }

  const move = (index: number, direction: -1 | 1) => {
    const next = [...setlist.songIds];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    const current = next[index];
    const other = next[target];
    if (!current || !other) return;
    next[index] = other;
    next[target] = current;
    reorder.mutate({ setlistId: setlist.id, songIds: next });
  };

  const saveMeta = async () => {
    await updateSetlist.mutateAsync({
      id: setlist.id,
      patch: {
        name: nameValue.trim() || setlist.name,
        description: descriptionValue.trim() || null,
      },
    });
    void navigate(`/setlists/${setlist.id}`);
  };

  return (
    <div>
      <PageHeader title="Editar setlist" backTo={`/setlists/${setlist.id}`} backLabel={setlist.name} />
      <div className="space-y-5 px-4 py-4">
        <label className="block">
          <span className="mb-1 block text-sm text-mute">Nome</span>
          <input
            value={nameValue}
            onChange={(event) => setName(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-stage-border bg-stage-raised px-3"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-mute">Descrição</span>
          <input
            value={descriptionValue}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-stage-border bg-stage-raised px-3"
          />
        </label>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-[0.2em] text-mute">ORDEM DO SHOW</h2>
          {ordered.length === 0 ? (
            <EmptyState title="Nenhuma música" description="Adicione músicas abaixo." />
          ) : (
            ordered.map((song, index) => (
              <div
                key={`${song.id}-${String(index)}`}
                className="flex items-center gap-2 rounded-2xl border border-stage-border bg-stage-raised px-3 py-3"
              >
                <span className="w-8 text-mute">{String(index + 1).padStart(2, '0')}</span>
                <span className="min-w-0 flex-1 truncate font-semibold">{song.title}</span>
                <span className="text-sm text-gold">{song.currentKey}</span>
                <button
                  type="button"
                  aria-label="Subir"
                  onClick={() => move(index, -1)}
                  className="min-h-11 min-w-11 rounded-xl bg-stage-elevated"
                >
                  ▲
                </button>
                <button
                  type="button"
                  aria-label="Descer"
                  onClick={() => move(index, 1)}
                  className="min-h-11 min-w-11 rounded-xl bg-stage-elevated"
                >
                  ▼
                </button>
                <button
                  type="button"
                  aria-label="Remover"
                  onClick={() =>
                    removeSong.mutate({ setlistId: setlist.id, songId: song.id })
                  }
                  className="min-h-11 min-w-11 rounded-xl text-danger"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold tracking-[0.2em] text-mute">ADICIONAR MÚSICAS</h2>
          <SearchBar value={query} onChange={setQuery} placeholder="Buscar para adicionar..." />
          {available.slice(0, 40).map((song) => (
            <button
              key={song.id}
              type="button"
              onClick={() => addSong.mutate({ setlistId: setlist.id, songId: song.id })}
              className="flex min-h-14 w-full items-center justify-between rounded-2xl border border-stage-border bg-stage-raised px-4 text-left"
            >
              <span className="truncate font-semibold">{song.title}</span>
              <span className="text-gold">{song.currentKey}</span>
            </button>
          ))}
        </section>

        <button
          type="button"
          onClick={() => void saveMeta()}
          className="min-h-14 w-full rounded-2xl bg-gold font-bold text-stage"
        >
          Concluir
        </button>
      </div>
    </div>
  );
}
