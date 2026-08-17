export interface Song {
  id: string;
  title: string;
  artist?: string | null;
  originalKey: string;
  currentKey: string;
  lyrics?: string | null;
  chords?: string | null;
  notes?: string | null;
  favorite: boolean;
}

export type SongDraft = Omit<Song, 'id' | 'favorite' | 'currentKey'> & {
  favorite?: boolean;
  currentKey?: string;
};
