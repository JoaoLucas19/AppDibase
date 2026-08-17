import type { Song } from '../songs/types';

export interface Block {
  id: string;
  name: string;
  order: number;
}

export interface BlockSong {
  blockId: string;
  songId: string;
  order: number;
}

export interface OrderedSong {
  song: Song;
  order: number;
}

export interface BlockWithSongs {
  block: Block;
  songs: OrderedSong[];
}
