import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateSong } from '@/hooks/useMutations';
import { describeKey, KEY_CHOICES } from '@/services/harmony';
import { songHref } from '@/utils/routes';

interface AddSongButtonProps {
  blockId?: string;
}

export function AddSongButton({ blockId }: AddSongButtonProps) {
  const navigate = useNavigate();
  const createSong = useCreateSong();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [originalKey, setOriginalKey] = useState('C');

  const close = () => {
    setOpen(false);
    setTitle('');
    setOriginalKey('C');
  };

  const submit = async () => {
    const name = title.trim();
    if (!name) return;

    const created = await createSong.mutateAsync({
      title: name,
      originalKey,
      blockId,
    });

    close();
    void navigate(
      songHref(created.song.id, blockId ? { type: 'block', id: blockId } : { type: 'all' }),
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Adicionar música"
        className="flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-gold text-2xl font-bold leading-none text-stage"
      >
        +
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 sm:items-center">
          <form
            className="w-full max-w-md space-y-4 rounded-2xl border border-stage-border bg-stage px-4 py-5"
            onSubmit={(event) => {
              event.preventDefault();
              void submit();
            }}
          >
            <h2 className="text-xl font-bold">Nova música</h2>
            <label className="block">
              <span className="mb-1 block text-sm text-mute">Nome da música</span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                autoFocus
                placeholder="Ex.: P do Pecado"
                className="min-h-12 w-full rounded-xl border border-stage-border bg-stage-raised px-3"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-mute">Tom</span>
              <select
                value={originalKey}
                onChange={(event) => setOriginalKey(event.target.value)}
                required
                className="min-h-12 w-full rounded-xl border border-stage-border bg-stage-raised px-3"
              >
                {KEY_CHOICES.map((key) => (
                  <option key={key} value={key}>
                    {key} — {describeKey(key)}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                type="button"
                onClick={close}
                className="min-h-12 rounded-xl bg-stage-elevated font-semibold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={createSong.isPending || !title.trim()}
                className="min-h-12 rounded-xl bg-gold font-bold text-stage disabled:opacity-40"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </>
  );
}
