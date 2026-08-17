import { useState } from 'react';
import { usePwaInstall } from '@/hooks/usePwaInstall';

export function InstallAppCard() {
  const { canPrompt, installed, install } = usePwaInstall();
  const [open, setOpen] = useState(false);

  if (installed) return null;

  return (
    <section className="rounded-2xl border border-stage-border bg-stage-raised px-4 py-4">
      <p className="font-semibold">Instalar o app</p>
      <p className="mt-1 text-sm text-mute">
        No Brave, o atalho fica em Adicionar à tela inicial. Não precisa da loja.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {canPrompt ? (
          <button
            type="button"
            onClick={() => void install()}
            className="min-h-12 rounded-xl bg-gold px-4 font-bold text-stage"
          >
            Instalar agora
          </button>
        ) : null}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="min-h-12 rounded-xl bg-stage-elevated px-4 font-semibold"
        >
          {open ? 'Ocultar passos' : 'Como instalar no Brave'}
        </button>
      </div>
      {open ? (
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-mute">
          <li>Toque no ícone do escudo e libere este site (Shields baixo ou desligado).</li>
          <li>Abra o menu do Brave (ícone com três linhas ou três pontos).</li>
          <li>Toque em Adicionar à tela inicial ou Add to Home screen.</li>
          <li>Confirme o nome Dibase e adicione.</li>
          <li>Abra pelo ícone na tela inicial, não pela lista de abas.</li>
        </ol>
      ) : null}
    </section>
  );
}
