import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { SearchBar } from '@/components/SearchBar';
import { SongCard } from '@/components/SongCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { useBlocks, useRelations, useSongs } from '@/hooks/useCatalog';
import { searchSongs } from '@/services/search';
import { songHref } from '@/utils/routes';

type SortMode = 'title' | 'key' | 'block';

export function SongsPage() {
  const songsQuery = useSongs();
  const blocksQuery = useBlocks();
  const relationsQuery = useRelations();
  const [query, setQuery] = useState('');
  const [keyFilter, setKeyFilter] = useState('all');
  const [blockFilter, setBlockFilter] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [sort, setSort] = useState<SortMode>('title');

  const keys = useMemo(() => {
    const unique = new Set((songsQuery.data ?? []).map((song) => song.originalKey));
    return [...unique].sort((a, b) => a.localeCompare(b, 'pt-BR'));
  }, [songsQuery.data]);

  const filtered = useMemo(() => {
    if (!songsQuery.data || !blocksQuery.data || !relationsQuery.data) return [];

    let list = searchSongs(songsQuery.data, blocksQuery.data, relationsQuery.data, query);

    if (favoritesOnly) {
      list = list.filter((song) => song.favorite);
    }

    if (keyFilter !== 'all') {
      list = list.filter(
        (song) => song.originalKey === keyFilter || song.currentKey === keyFilter,
      );
    }

    if (blockFilter !== 'all') {
      const ids = new Set(
        relationsQuery.data
          .filter((item) => item.blockId === blockFilter)
          .map((item) => item.songId),
      );
      list = list.filter((song) => ids.has(song.id));
    }

    const relations = relationsQuery.data;
    const blockOrder = new Map(
      (blocksQuery.data ?? []).map((block) => [block.id, block.order]),
    );

    const firstBlockOrder = (songId: string) => {
      const orders = relations
        .filter((item) => item.songId === songId)
        .map((item) => blockOrder.get(item.blockId) ?? 999);
      return Math.min(...orders);
    };

    return [...list].sort((a, b) => {
      if (sort === 'key') return a.currentKey.localeCompare(b.currentKey, 'pt-BR');
      if (sort === 'block') return firstBlockOrder(a.id) - firstBlockOrder(b.id);
      return a.title.localeCompare(b.title, 'pt-BR');
    });
  }, [
    blockFilter,
    blocksQuery.data,
    favoritesOnly,
    keyFilter,
    query,
    relationsQuery.data,
    songsQuery.data,
    sort,
  ]);

  if (songsQuery.isLoading || blocksQuery.isLoading || relationsQuery.isLoading) {
    return <LoadingState />;
  }

  if (songsQuery.isError || blocksQuery.isError || relationsQuery.isError) {
    return <ErrorState message="Não foi possível carregar as músicas." />;
  }

  return (
    <div>
      <PageHeader title="Todas as músicas" />
      <div className="space-y-4 px-4 py-4">
        <SearchBar value={query} onChange={setQuery} />

        <div className="flex gap-2 overflow-x-auto pb-1">
          <select
            aria-label="Filtrar por tom"
            value={keyFilter}
            onChange={(event) => setKeyFilter(event.target.value)}
            className="min-h-12 rounded-xl border border-stage-border bg-stage-raised px-3"
          >
            <option value="all">Todos os tons</option>
            {keys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <select
            aria-label="Filtrar por bloco"
            value={blockFilter}
            onChange={(event) => setBlockFilter(event.target.value)}
            className="min-h-12 rounded-xl border border-stage-border bg-stage-raised px-3"
          >
            <option value="all">Todos os blocos</option>
            {(blocksQuery.data ?? []).map((block) => (
              <option key={block.id} value={block.id}>
                {block.name}
              </option>
            ))}
          </select>
          <select
            aria-label="Ordenar"
            value={sort}
            onChange={(event) => setSort(event.target.value as SortMode)}
            className="min-h-12 rounded-xl border border-stage-border bg-stage-raised px-3"
          >
            <option value="title">A-Z</option>
            <option value="key">Tom</option>
            <option value="block">Bloco</option>
          </select>
          <button
            type="button"
            onClick={() => setFavoritesOnly((value) => !value)}
            className={`min-h-12 shrink-0 rounded-xl px-4 font-semibold ${
              favoritesOnly ? 'bg-gold text-stage' : 'bg-stage-raised'
            }`}
          >
            ⭐ Favoritos
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="Nenhuma música encontrada"
            description="Ajuste a busca ou os filtros."
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((song) => (
              <SongCard key={song.id} song={song} href={songHref(song.id, { type: 'all' })} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
