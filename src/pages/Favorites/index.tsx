import { useMemo } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { SongCard } from '@/components/SongCard';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { useSongs } from '@/hooks/useCatalog';
import { songHref } from '@/utils/routes';

export function FavoritesPage() {
  const songsQuery = useSongs();

  const favorites = useMemo(
    () => (songsQuery.data ?? []).filter((song) => song.favorite),
    [songsQuery.data],
  );

  if (songsQuery.isLoading) return <LoadingState />;
  if (songsQuery.isError) {
    return <ErrorState message="Não foi possível carregar os favoritos." />;
  }

  return (
    <div>
      <PageHeader title="⭐ Favoritos" />
      <div className="space-y-3 px-4 py-4">
        {favorites.length === 0 ? (
          <EmptyState
            title="Nenhuma favorita ainda"
            description="Toque em ☆ na tela da música para guardar atalhos rápidos."
          />
        ) : (
          favorites.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              href={songHref(song.id, { type: 'favorites' })}
            />
          ))
        )}
      </div>
    </div>
  );
}
