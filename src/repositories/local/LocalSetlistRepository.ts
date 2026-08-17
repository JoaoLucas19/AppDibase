import type { Setlist, SetlistDraft } from '@/domain';
import type { SetlistRepository } from '@/repositories/SetlistRepository';
import { idbDelete, idbGet, idbGetAll, idbPut, STORES } from '@/storage/indexeddb';
import { createId, nowIso } from '@/utils/ids';

export class LocalSetlistRepository implements SetlistRepository {
  async getAll(): Promise<Setlist[]> {
    const setlists = await idbGetAll<Setlist>(STORES.setlists);
    return setlists.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async getById(id: string): Promise<Setlist | null> {
    const setlist = await idbGet<Setlist>(STORES.setlists, id);
    return setlist ?? null;
  }

  async create(draft: SetlistDraft): Promise<Setlist> {
    const timestamp = nowIso();
    const setlist: Setlist = {
      id: createId('setlist'),
      name: draft.name.trim(),
      description: draft.description?.trim() || null,
      songIds: draft.songIds ?? [],
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    await idbPut(STORES.setlists, setlist);
    return setlist;
  }

  async update(
    id: string,
    patch: Partial<Omit<Setlist, 'id' | 'createdAt'>>,
  ): Promise<Setlist> {
    const current = await this.getById(id);
    if (!current) {
      throw new Error('Setlist não encontrada.');
    }
    const updated: Setlist = {
      ...current,
      ...patch,
      id,
      createdAt: current.createdAt,
      updatedAt: nowIso(),
    };
    await idbPut(STORES.setlists, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await idbDelete(STORES.setlists, id);
  }

  async addSong(setlistId: string, songId: string): Promise<Setlist> {
    const current = await this.require(setlistId);
    if (current.songIds.includes(songId)) {
      return current;
    }
    return this.update(setlistId, { songIds: [...current.songIds, songId] });
  }

  async removeSong(setlistId: string, songId: string): Promise<Setlist> {
    const current = await this.require(setlistId);
    return this.update(setlistId, {
      songIds: current.songIds.filter((id) => id !== songId),
    });
  }

  async reorderSongs(setlistId: string, songIds: string[]): Promise<Setlist> {
    return this.update(setlistId, { songIds });
  }

  private async require(id: string): Promise<Setlist> {
    const setlist = await this.getById(id);
    if (!setlist) {
      throw new Error('Setlist não encontrada.');
    }
    return setlist;
  }
}
