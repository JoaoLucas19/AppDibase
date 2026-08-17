import type { Setlist, SetlistDraft } from '@/domain';

export interface SetlistRepository {
  getAll(): Promise<Setlist[]>;
  getById(id: string): Promise<Setlist | null>;
  create(draft: SetlistDraft): Promise<Setlist>;
  update(id: string, patch: Partial<Omit<Setlist, 'id' | 'createdAt'>>): Promise<Setlist>;
  delete(id: string): Promise<void>;
  addSong(setlistId: string, songId: string): Promise<Setlist>;
  removeSong(setlistId: string, songId: string): Promise<Setlist>;
  reorderSongs(setlistId: string, songIds: string[]): Promise<Setlist>;
}
