export type SyncStatus = 'local';

/**
 * Reservado para a futura API própria deste aplicativo.
 * A primeira versão permanece 100% local e não faz chamadas remotas.
 */
export async function syncRepertoire(): Promise<{ status: SyncStatus }> {
  return { status: 'local' };
}
