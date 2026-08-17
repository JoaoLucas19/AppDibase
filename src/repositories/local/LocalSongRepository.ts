import type { Song, SongDraft } from '@/domain';
import type { SongRepository } from '@/repositories/SongRepository';
import { idbDelete, idbGet, idbGetAll, idbPut, STORES } from '@/storage/indexeddb';
import { createId } from '@/utils/ids';

export class LocalSongRepository implements SongRepository {
  async getAll(): Promise<Song[]> {
    const songs = await idbGetAll<Song>(STORES.songs);
    return songs.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
  }

  async getById(id: string): Promise<Song | null> {
    const song = await idbGet<Song>(STORES.songs, id);
    return song ?? null;
  }

  async getByIds(ids: string[]): Promise<Song[]> {
    const songs = await Promise.all(ids.map((id) => this.getById(id)));
    return ids
      .map((id) => songs.find((song) => song?.id === id) ?? null)
      .filter((song): song is Song => song !== null);
  }

  async create(draft: SongDraft): Promise<Song> {
    const song: Song = {
      id: createId('song'),
      title: draft.title,
      artist: draft.artist ?? null,
      originalKey: draft.originalKey,
      currentKey: draft.currentKey ?? draft.originalKey,
      lyrics: draft.lyrics ?? null,
      chords: draft.chords ?? null,
      notes: draft.notes ?? null,
      favorite: draft.favorite ?? false,
    };
    await idbPut(STORES.songs, song);
    return song;
  }

  async update(id: string, patch: Partial<Omit<Song, 'id'>>): Promise<Song> {
    const current = await this.getById(id);
    if (!current) {
      throw new Error('Música não encontrada.');
    }
    const updated: Song = { ...current, ...patch, id };
    await idbPut(STORES.songs, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    await idbDelete(STORES.songs, id);
  }

  async toggleFavorite(id: string): Promise<Song> {
    const current = await this.getById(id);
    if (!current) {
      throw new Error('Música não encontrada.');
    }
    return this.update(id, { favorite: !current.favorite });
  }

  async updateCurrentKey(id: string, key: string): Promise<Song> {
    return this.update(id, { currentKey: key });
  }

  async restoreOriginalKey(id: string): Promise<Song> {
    const current = await this.getById(id);
    if (!current) {
      throw new Error('Música não encontrada.');
    }
    return this.update(id, { currentKey: current.originalKey });
  }
}
