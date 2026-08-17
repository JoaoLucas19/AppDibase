import type { BlockRepository } from './BlockRepository';
import type { SetlistRepository } from './SetlistRepository';
import type { SongRepository } from './SongRepository';
import { LocalBlockRepository } from './local/LocalBlockRepository';
import { LocalSetlistRepository } from './local/LocalSetlistRepository';
import { LocalSongRepository } from './local/LocalSongRepository';

export interface Repositories {
  songs: SongRepository;
  blocks: BlockRepository;
  setlists: SetlistRepository;
}

export function createLocalRepositories(): Repositories {
  return {
    songs: new LocalSongRepository(),
    blocks: new LocalBlockRepository(),
    setlists: new LocalSetlistRepository(),
  };
}

/**
 * v1 usa repositórios locais (IndexedDB).
 * No futuro, trocar por ApiSongRepository / ApiBlockRepository / ApiSetlistRepository
 * sem reescrever a interface.
 */
export function createRepositories(): Repositories {
  return createLocalRepositories();
}
