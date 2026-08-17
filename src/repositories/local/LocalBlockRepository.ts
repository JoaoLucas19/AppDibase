import type { Block, BlockSong, OrderedSong, Song } from '@/domain';
import type { BlockRepository } from '@/repositories/BlockRepository';
import { idbDelete, idbGet, idbGetAll, idbPut, STORES } from '@/storage/indexeddb';

export class LocalBlockRepository implements BlockRepository {
  async getAll(): Promise<Block[]> {
    const blocks = await idbGetAll<Block>(STORES.blocks);
    return blocks.sort((a, b) => a.order - b.order);
  }

  async getById(id: string): Promise<Block | null> {
    const block = await idbGet<Block>(STORES.blocks, id);
    return block ?? null;
  }

  async getRelations(): Promise<BlockSong[]> {
    return idbGetAll<BlockSong>(STORES.blockSongs);
  }

  async getSongs(blockId: string): Promise<OrderedSong[]> {
    const relations = (await this.getRelations())
      .filter((item) => item.blockId === blockId)
      .sort((a, b) => a.order - b.order);

    const songs = await idbGetAll<Song>(STORES.songs);
    const songsById = new Map(songs.map((song) => [song.id, song]));

    return relations.flatMap((relation) => {
      const song = songsById.get(relation.songId);
      return song ? [{ song, order: relation.order }] : [];
    });
  }

  async getBlocksForSong(songId: string): Promise<Block[]> {
    const relations = (await this.getRelations()).filter((item) => item.songId === songId);
    const blocks = await this.getAll();
    const blockIds = new Set(relations.map((item) => item.blockId));
    return blocks.filter((block) => blockIds.has(block.id));
  }

  async create(block: Block): Promise<Block> {
    await idbPut(STORES.blocks, block);
    return block;
  }

  async update(id: string, patch: Partial<Omit<Block, 'id'>>): Promise<Block> {
    const current = await this.getById(id);
    if (!current) {
      throw new Error('Bloco não encontrado.');
    }
    const updated: Block = { ...current, ...patch, id };
    await idbPut(STORES.blocks, updated);
    return updated;
  }

  async delete(id: string): Promise<void> {
    const relations = (await this.getRelations()).filter((item) => item.blockId === id);
    await Promise.all(
      relations.map((item) => idbDelete(STORES.blockSongs, [item.blockId, item.songId])),
    );
    await idbDelete(STORES.blocks, id);
  }

  async addSong(blockId: string, songId: string, order?: number): Promise<void> {
    const existing = await this.getSongs(blockId);
    const nextOrder = order ?? existing.length + 1;
    await idbPut<BlockSong>(STORES.blockSongs, { blockId, songId, order: nextOrder });
  }

  async removeSong(blockId: string, songId: string): Promise<void> {
    await idbDelete(STORES.blockSongs, [blockId, songId]);
    const remaining = await this.getSongs(blockId);
    await this.reorderSongs(
      blockId,
      remaining.map((item) => item.song.id),
    );
  }

  async reorderSongs(blockId: string, songIds: string[]): Promise<void> {
    await Promise.all(
      songIds.map((songId, index) =>
        idbPut<BlockSong>(STORES.blockSongs, {
          blockId,
          songId,
          order: index + 1,
        }),
      ),
    );
  }
}
