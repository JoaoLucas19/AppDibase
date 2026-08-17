import { Link, useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { SongCard } from '@/components/SongCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { useSetlist, useSongs } from '@/hooks/useCatalog';
import { useDeleteSetlist } from '@/hooks/useMutations';
import { showHref, songHref } from '@/utils/routes';

export function SetlistDetailsPage() {
  const { setlistId } = useParams();
  const navigate = useNavigate();
  const setlistQuery = useSetlist(setlistId);
  const songsQuery = useSongs();
  const deleteSetlist = useDeleteSetlist();

  if (setlistQuery.isLoading || songsQuery.isLoading) return <LoadingState />;
  if (setlistQuery.isError || songsQuery.isError) {
    return <ErrorState message="Não foi possível abrir a setlist." />;
  }
  if (!setlistQuery.data) {
    return <EmptyState title="Setlist não encontrada" description="Ela pode ter sido excluída." />;
  }

  const setlist = setlistQuery.data;
  const songsById = new Map((songsQuery.data ?? []).map((song) => [song.id, song]));
  const ordered = setlist.songIds.flatMap((id) => {
    const song = songsById.get(id);
    return song ? [song] : [];
  });
  const first = ordered[0];

  const remove = async () => {
    if (!window.confirm(`Excluir a setlist "${setlist.name}"?`)) return;
    await deleteSetlist.mutateAsync(setlist.id);
    void navigate('/setlists');
  };

  return (
    <div>
      <PageHeader title={setlist.name} backTo="/setlists" backLabel="Setlists" />
      <div className="space-y-4 px-4 py-4">
        {setlist.description ? <p className="text-mute">{setlist.description}</p> : null}

        <div className="grid grid-cols-2 gap-3">
          {first ? (
            <Link
              to={showHref(first.id, { type: 'setlist', id: setlist.id })}
              className="flex min-h-14 items-center justify-center rounded-2xl bg-gold font-bold text-stage"
            >
              🎤 Modo Show
            </Link>
          ) : (
            <div className="flex min-h-14 items-center justify-center rounded-2xl bg-stage-raised text-mute">
              Sem músicas
            </div>
          )}
          <Link
            to={`/setlists/${setlist.id}/edit`}
            className="flex min-h-14 items-center justify-center rounded-2xl bg-stage-elevated font-semibold"
          >
            Editar
          </Link>
        </div>

        {ordered.length === 0 ? (
          <EmptyState
            title="Setlist vazia"
            description="Adicione músicas para usar no show."
          />
        ) : (
          ordered.map((song, index) => (
            <SongCard
              key={`${setlist.id}-${song.id}-${String(index)}`}
              song={song}
              order={index + 1}
              href={songHref(song.id, { type: 'setlist', id: setlist.id })}
            />
          ))
        )}

        <button
          type="button"
          onClick={() => void remove()}
          className="min-h-12 w-full text-sm font-semibold text-danger"
        >
          Excluir setlist
        </button>
      </div>
    </div>
  );
}
