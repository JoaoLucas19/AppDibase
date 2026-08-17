import type { Song, SongDraft } from '@/domain';

export interface SongRepository {
  getAll(): Promise<Song[]>;
  getById(id: string): Promise<Song | null>;
  getByIds(ids: string[]): Promise<Song[]>;
  create(draft: SongDraft): Promise<Song>;
  update(id: string, patch: Partial<Omit<Song, 'id'>>): Promise<Song>;
  delete(id: string): Promise<void>;
  toggleFavorite(id: string): Promise<Song>;
  updateCurrentKey(id: string, key: string): Promise<Song>;
  restoreOriginalKey(id: string): Promise<Song>;
}
