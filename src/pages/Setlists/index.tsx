import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { EmptyState, ErrorState, LoadingState } from '@/components/States';
import { useSetlists } from '@/hooks/useCatalog';
import { useCreateSetlist } from '@/hooks/useMutations';
import { pluralize } from '@/utils/ids';

export function SetlistsPage() {
  const setlistsQuery = useSetlists();
  const createSetlist = useCreateSetlist();
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (setlistsQuery.isLoading) return <LoadingState />;
  if (setlistsQuery.isError) {
    return <ErrorState message="Não foi possível carregar as setlists." />;
  }

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const created = await createSetlist.mutateAsync({
      name: trimmed,
      description: description.trim() || undefined,
    });
    setName('');
    setDescription('');
    setCreating(false);
    void navigate(`/setlists/${created.id}/edit`);
  };

  return (
    <div>
      <PageHeader
        title="🎤 Setlists"
        actions={
          <button
            type="button"
            onClick={() => setCreating((value) => !value)}
            className="min-h-11 rounded-xl bg-gold px-3 font-bold text-stage"
          >
            {creating ? 'Cancelar' : 'Criar'}
          </button>
        }
      />
      <div className="space-y-3 px-4 py-4">
        {creating ? (
          <form
            className="space-y-3 rounded-2xl border border-stage-border bg-stage-raised p-4"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <label className="block">
              <span className="mb-1 block text-sm text-mute">Nome</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="min-h-12 w-full rounded-xl border border-stage-border bg-stage px-3"
                placeholder="Festa Junina 2026"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-mute">Descrição</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="min-h-12 w-full rounded-xl border border-stage-border bg-stage px-3"
                placeholder="Opcional"
              />
            </label>
            <button
              type="submit"
              className="min-h-12 w-full rounded-xl bg-gold font-bold text-stage"
            >
              Criar setlist
            </button>
          </form>
        ) : null}

        {(setlistsQuery.data ?? []).length === 0 ? (
          <EmptyState
            title="Nenhuma setlist"
            description="Crie uma apresentação com a ordem das músicas do show."
          />
        ) : (
          (setlistsQuery.data ?? []).map((setlist) => (
            <Link
              key={setlist.id}
              to={`/setlists/${setlist.id}`}
              className="block rounded-2xl border border-stage-border bg-stage-raised px-4 py-4"
            >
              <p className="text-lg font-semibold">{setlist.name}</p>
              <p className="text-sm text-mute">
                {pluralize(setlist.songIds.length, 'música', 'músicas')}
              </p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
