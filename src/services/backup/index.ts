import type { Block, BlockSong, Setlist, Song } from '@/domain';
import {
  idbGetAll,
  idbReplaceAll,
  STORES,
} from '@/storage/indexeddb';

export const BACKUP_VERSION = 1;
export const BACKUP_APP = 'repertorio-dibase';

export interface RepertoireBackup {
  version: number;
  app: string;
  exportedAt: string;
  songs: Song[];
  blocks: Block[];
  blockSongs: BlockSong[];
  setlists: Setlist[];
}

export async function exportRepertoire(): Promise<RepertoireBackup> {
  const [songs, blocks, blockSongs, setlists] = await Promise.all([
    idbGetAll<Song>(STORES.songs),
    idbGetAll<Block>(STORES.blocks),
    idbGetAll<BlockSong>(STORES.blockSongs),
    idbGetAll<Setlist>(STORES.setlists),
  ]);

  return {
    version: BACKUP_VERSION,
    app: BACKUP_APP,
    exportedAt: new Date().toISOString(),
    songs,
    blocks,
    blockSongs,
    setlists,
  };
}

export function downloadBackup(backup: RepertoireBackup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const stamp = backup.exportedAt.slice(0, 10);
  const link = document.createElement('a');
  link.href = url;
  link.download = `repertorio-dibase-${stamp}.json`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function parseBackup(payload: unknown): RepertoireBackup {
  if (!isRecord(payload)) {
    throw new Error('Arquivo de backup inválido.');
  }

  if (payload.app !== BACKUP_APP && payload.app !== undefined) {
    throw new Error('Este arquivo não é um backup do Repertório Dibase.');
  }

  const songs = payload.songs;
  const blocks = payload.blocks;
  const blockSongs = payload.blockSongs;
  const setlists = payload.setlists;

  if (!Array.isArray(songs) || !Array.isArray(blocks) || !Array.isArray(blockSongs) || !Array.isArray(setlists)) {
    throw new Error('O backup está incompleto.');
  }

  return {
    version: Number(payload.version) || BACKUP_VERSION,
    app: BACKUP_APP,
    exportedAt: typeof payload.exportedAt === 'string' ? payload.exportedAt : new Date().toISOString(),
    songs: songs as Song[],
    blocks: blocks as Block[],
    blockSongs: blockSongs as BlockSong[],
    setlists: setlists as Setlist[],
  };
}

export async function restoreRepertoire(backup: RepertoireBackup): Promise<void> {
  await idbReplaceAll(STORES.songs, backup.songs);
  await idbReplaceAll(STORES.blocks, backup.blocks);
  await idbReplaceAll(STORES.blockSongs, backup.blockSongs);
  await idbReplaceAll(STORES.setlists, backup.setlists);
}
