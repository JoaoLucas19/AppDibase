import { useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/PageHeader';
import {
  downloadBackup,
  exportRepertoire,
  parseBackup,
  restoreRepertoire,
} from '@/services/backup';

export function SettingsPage() {
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const exportNow = async () => {
    setError('');
    setMessage('');
    setBusy(true);
    try {
      const backup = await exportRepertoire();
      downloadBackup(backup);
      setMessage('Backup baixado. Guarde o arquivo no celular ou no Google Drive.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível exportar.');
    } finally {
      setBusy(false);
    }
  };

  const importNow = async (file: File) => {
    setError('');
    setMessage('');
    setBusy(true);
    try {
      const text = await file.text();
      const backup = parseBackup(JSON.parse(text) as unknown);
      const confirmed = window.confirm(
        'Isso substitui músicas, blocos, favoritos e setlists deste aparelho. Continuar?',
      );
      if (!confirmed) return;
      await restoreRepertoire(backup);
      await queryClient.invalidateQueries();
      setMessage('Repertório restaurado neste aparelho.');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível restaurar o backup.');
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      <PageHeader title="Ajustes" backTo="/" backLabel="Início" />
      <div className="space-y-5 px-4 py-4">
        <section className="space-y-3 rounded-2xl bg-stage-raised p-4">
          <h2 className="text-lg font-bold">Backup local</h2>
          <p className="text-sm leading-relaxed text-mute">
            O repertório fica neste celular. Exporte um arquivo JSON para não perder cifras,
            favoritos e setlists se o app for desinstalado.
          </p>
          <button
            type="button"
            onClick={() => void exportNow()}
            disabled={busy}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-gold font-bold text-stage disabled:opacity-40"
          >
            Exportar backup
          </button>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="flex min-h-12 w-full items-center justify-center rounded-xl bg-stage-elevated font-semibold disabled:opacity-40"
          >
            Restaurar backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void importNow(file);
            }}
          />
        </section>

        {message ? (
          <p className="rounded-2xl bg-stage-elevated px-4 py-3 text-sm text-gold">{message}</p>
        ) : null}
        {error ? (
          <p className="rounded-2xl bg-stage-elevated px-4 py-3 text-sm text-danger">{error}</p>
        ) : null}

        <section className="space-y-2 rounded-2xl bg-stage-raised p-4">
          <h2 className="text-lg font-bold">Modo Show</h2>
          <p className="text-sm leading-relaxed text-mute">
            No palco, a tela tenta ficar ligada e a cifra muda de tom junto com os botões + e −.
            Use A+ e A− para o tamanho da letra.
          </p>
        </section>
      </div>
    </div>
  );
}
