import { Link, useParams } from 'react-router-dom';
import { AddSongButton } from '@/components/AddSongButton';
import { PageHeader } from '@/components/PageHeader';
import { SongCard } from '@/components/SongCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { useBlock, useBlockSongs } from '@/hooks/useCatalog';
import { showHref, songHref } from '@/utils/routes';

export function BlockDetailsPage() {
  const { blockId } = useParams();
  const blockQuery = useBlock(blockId);
  const songsQuery = useBlockSongs(blockId);

  if (blockQuery.isLoading || songsQuery.isLoading) {
    return <LoadingState />;
  }

  if (blockQuery.isError || songsQuery.isError) {
    return <ErrorState message="Não foi possível abrir este bloco." />;
  }

  const block = blockQuery.data;
  if (!block) {
    return <EmptyState title="Bloco não encontrado" description="Ele pode ter sido removido." />;
  }

  const items = songsQuery.data ?? [];
  const firstSong = items[0]?.song;

  return (
    <div>
      <PageHeader
        title={block.name}
        backTo="/"
        backLabel="Repertório"
        actions={
          <div className="flex items-center gap-2">
            <AddSongButton blockId={block.id} />
            {firstSong ? (
              <Link
                to={showHref(firstSong.id, { type: 'block', id: block.id })}
                className="min-h-11 rounded-xl bg-gold px-3 py-2 text-sm font-bold text-stage"
              >
                Show
              </Link>
            ) : null}
          </div>
        }
      />
      <div className="space-y-3 px-4 py-4">
        {items.length === 0 ? (
          <EmptyState title="Bloco vazio" description="Nenhuma música neste bloco." />
        ) : (
          items.map((item) => (
            <SongCard
              key={`${block.id}-${item.song.id}-${String(item.order)}`}
              song={item.song}
              order={item.order}
              href={songHref(item.song.id, { type: 'block', id: block.id })}
            />
          ))
        )}
      </div>
    </div>
  );
}
