import type { Block, BlockSong, OrderedSong } from '@/domain';

export interface BlockRepository {
  getAll(): Promise<Block[]>;
  getById(id: string): Promise<Block | null>;
  getRelations(): Promise<BlockSong[]>;
  getSongs(blockId: string): Promise<OrderedSong[]>;
  getBlocksForSong(songId: string): Promise<Block[]>;
  create(block: Block): Promise<Block>;
  update(id: string, patch: Partial<Omit<Block, 'id'>>): Promise<Block>;
  delete(id: string): Promise<void>;
  addSong(blockId: string, songId: string, order?: number): Promise<void>;
  removeSong(blockId: string, songId: string): Promise<void>;
  reorderSongs(blockId: string, songIds: string[]): Promise<void>;
}
