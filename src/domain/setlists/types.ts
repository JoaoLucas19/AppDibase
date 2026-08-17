export interface Setlist {
  id: string;
  name: string;
  description?: string | null;
  songIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface SetlistDraft {
  name: string;
  description?: string | null;
  songIds?: string[];
}
