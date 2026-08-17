import { useMemo } from 'react';
import { BlockCard } from '@/components/BlockCard';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { useBlocks, useRelations } from '@/hooks/useCatalog';

export function BlocksPage() {
  const blocksQuery = useBlocks();
  const relationsQuery = useRelations();

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const relation of relationsQuery.data ?? []) {
      map.set(relation.blockId, (map.get(relation.blockId) ?? 0) + 1);
    }
    return map;
  }, [relationsQuery.data]);

  if (blocksQuery.isLoading || relationsQuery.isLoading) return <LoadingState />;
  if (blocksQuery.isError || relationsQuery.isError) {
    return <ErrorState message="Não foi possível carregar os blocos." />;
  }

  const blocks = blocksQuery.data ?? [];

  return (
    <div>
      <PageHeader title="📚 Blocos" backTo="/" backLabel="Repertório" />
      <div className="space-y-3 px-4 py-4">
        {blocks.length === 0 ? (
          <EmptyState title="Nenhum bloco" description="O repertório ainda não foi carregado." />
        ) : (
          blocks.map((block) => (
            <BlockCard
              key={block.id}
              number={block.order}
              name={block.name}
              songCount={counts.get(block.id) ?? 0}
              href={`/blocks/${block.id}`}
            />
          ))
        )}
      </div>
    </div>
  );
}
