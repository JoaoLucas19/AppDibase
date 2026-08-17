export type { Song, SongDraft } from './songs/types';
export type { Block, BlockSong, OrderedSong, BlockWithSongs } from './blocks/types';
export type { Setlist, SetlistDraft } from './setlists/types';

export type PlayContextType = 'block' | 'setlist' | 'favorites' | 'all';

export interface PlayContext {
  type: PlayContextType;
  id?: string;
}
