import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export function OfflineBanner() {
  const online = useOnlineStatus();

  if (!online) {
    return (
      <div className="bg-gold/15 px-4 py-1.5 text-center text-sm text-gold">
        ⚠ Modo offline
      </div>
    );
  }

  return (
    <div className="banner-updated overflow-hidden bg-stage-elevated px-4 py-1.5 text-center text-sm text-mute">
      ✓ Repertório atualizado
    </div>
  );
}
