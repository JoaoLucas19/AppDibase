import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AddSongButton } from '@/components/AddSongButton';
import { BlockCard } from '@/components/BlockCard';
import { InstallAppCard } from '@/components/InstallAppCard';
import { PageHeader } from '@/components/PageHeader';
import { SearchBar } from '@/components/SearchBar';
import { SongCard } from '@/components/SongCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { useBlocks, useRelations, useSongs } from '@/hooks/useCatalog';
import { searchSongs } from '@/services/search';
import { songHref } from '@/utils/routes';
import { pluralize } from '@/utils/ids';

export function HomePage() {
  const songsQuery = useSongs();
  const blocksQuery = useBlocks();
  const relationsQuery = useRelations();
  const [query, setQuery] = useState('');

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const relation of relationsQuery.data ?? []) {
      map.set(relation.blockId, (map.get(relation.blockId) ?? 0) + 1);
    }
    return map;
  }, [relationsQuery.data]);

  const results = useMemo(() => {
    if (!songsQuery.data || !blocksQuery.data || !relationsQuery.data) return [];
    return searchSongs(songsQuery.data, blocksQuery.data, relationsQuery.data, query);
  }, [blocksQuery.data, query, relationsQuery.data, songsQuery.data]);

  if (songsQuery.isLoading || blocksQuery.isLoading || relationsQuery.isLoading) {
    return <LoadingState />;
  }

  if (songsQuery.isError || blocksQuery.isError || relationsQuery.isError) {
    return (
      <ErrorState
        message="Não foi possível carregar o repertório."
        onRetry={() => {
          void songsQuery.refetch();
          void blocksQuery.refetch();
          void relationsQuery.refetch();
        }}
      />
    );
  }

  const searching = query.trim().length > 0;

  return (
    <div>
      <PageHeader
        title="Repertório Dibase 🎵"
        actions={<AddSongButton />}
      />
      <div className="space-y-5 px-4 py-4">
        <SearchBar value={query} onChange={setQuery} />

        {searching ? (
          <section className="space-y-3">
            <p className="text-sm text-mute">{pluralize(results.length, 'resultado', 'resultados')}</p>
            {results.length === 0 ? (
              <EmptyState
                title="Nenhuma música encontrada"
                description="Tente buscar por título, tom ou número do bloco."
              />
            ) : (
              results.map((song) => (
                <SongCard key={song.id} song={song} href={songHref(song.id)} />
              ))
            )}
          </section>
        ) : (
          <>
            <InstallAppCard />
            <div className="grid grid-cols-3 gap-2">
              <Link
                to="/favorites"
                className="flex min-h-20 flex-col items-center justify-center rounded-2xl bg-stage-raised text-sm font-semibold"
              >
                ⭐ Favoritos
              </Link>
              <Link
                to="/setlists"
                className="flex min-h-20 flex-col items-center justify-center rounded-2xl bg-stage-raised text-sm font-semibold"
              >
                🎤 Setlists
              </Link>
              <Link
                to="/blocks"
                className="flex min-h-20 flex-col items-center justify-center rounded-2xl bg-stage-raised text-sm font-semibold"
              >
                📚 Blocos
              </Link>
            </div>

            <section className="space-y-3">
              <h2 className="text-sm font-semibold tracking-[0.2em] text-mute">BLOCOS</h2>
              {(blocksQuery.data ?? []).map((block) => (
                <BlockCard
                  key={block.id}
                  number={block.order}
                  name={block.name}
                  songCount={counts.get(block.id) ?? 0}
                  href={`/blocks/${block.id}`}
                />
              ))}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
